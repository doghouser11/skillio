"""Add school status and website fields

Revision ID: add_school_status_website
Revises: (previous revision)
Create Date: 2026-03-04 19:24:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

# revision identifiers
revision = 'add_school_status_website'
down_revision = None  # Replace with your last revision
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Add website column
    op.add_column('schools', sa.Column('website', sa.String(), nullable=True))
    
    # Create school status enum
    school_status_enum = sa.Enum('PENDING', 'APPROVED', 'REJECTED', name='schoolstatus')
    school_status_enum.create(op.get_bind())
    
    # Add status column
    op.add_column('schools', sa.Column('status', school_status_enum, nullable=True))
    
    # Set default values for existing records
    op.execute("UPDATE schools SET status = 'APPROVED' WHERE verified = true")
    op.execute("UPDATE schools SET status = 'PENDING' WHERE verified = false")
    
    # Make status not nullable after setting defaults
    op.alter_column('schools', 'status', nullable=False)

def downgrade() -> None:
    # Remove status column
    op.drop_column('schools', 'status')
    
    # Drop enum type
    sa.Enum(name='schoolstatus').drop(op.get_bind())
    
    # Remove website column
    op.drop_column('schools', 'website')