import os
import resend

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
FROM_EMAIL = os.getenv("FROM_EMAIL", "Skillio <noreply@skillio.live>")


def send_inquiry_notification(
    school_name: str,
    school_email: str | None,
    parent_name: str,
    parent_email: str,
    parent_phone: str | None,
    child_age: int | None,
    message: str,
):
    """Send email notification when a new inquiry is received."""
    if not RESEND_API_KEY:
        print("[EMAIL] RESEND_API_KEY not set, skipping email")
        return

    resend.api_key = RESEND_API_KEY

    # Build the email body
    phone_line = f"<p><strong>Телефон:</strong> {parent_phone}</p>" if parent_phone else ""
    age_line = f"<p><strong>Възраст на детето:</strong> {child_age} г.</p>" if child_age else ""

    html = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #166534; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0;">📩 Ново запитване за {school_name}</h2>
        <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">Изпратено през Skillio.live</p>
      </div>
      <div style="padding: 24px; background: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <h3 style="color: #374151; margin-top: 0;">Данни за родителя:</h3>
        <p><strong>Име:</strong> {parent_name}</p>
        <p><strong>Email:</strong> <a href="mailto:{parent_email}">{parent_email}</a></p>
        {phone_line}
        {age_line}
        <h3 style="color: #374151;">Съобщение:</h3>
        <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb;">
          <p style="margin: 0; white-space: pre-wrap;">{message}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          Това запитване е изпратено през <a href="https://skillio.live" style="color: #166534;">Skillio.live</a> — платформа за детски дейности в България.
          <br/>Отговорете директно на {parent_name} на <a href="mailto:{parent_email}">{parent_email}</a>.
        </p>
      </div>
    </div>
    """

    # Send to school owner if they have email
    recipients = []
    if school_email:
        recipients.append(school_email)

    # Always send a copy to admin
    admin_email = os.getenv("ADMIN_EMAIL", "kirchev@skillio.live")
    if admin_email not in recipients:
        recipients.append(admin_email)

    if not recipients:
        return

    try:
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": recipients,
            "reply_to": parent_email,
            "subject": f"Ново запитване за {school_name} | Skillio",
            "html": html,
        })
        print(f"[EMAIL] Inquiry notification sent to {recipients}")
    except Exception as e:
        print(f"[EMAIL] Failed to send: {e}")
