"""change price_monthly from float to string

Revision ID: 002_price_monthly_to_string
Revises: 001
Create Date: 2026-03-06 14:50:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '002_price_monthly_to_string'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Change price_monthly from FLOAT to TEXT for flexible pricing
    op.alter_column('activities', 'price_monthly',
                    existing_type=sa.FLOAT(),
                    type_=sa.String(),
                    postgresql_using='price_monthly::text')


def downgrade() -> None:
    # Revert back to FLOAT (may lose data if text values can't convert)
    op.alter_column('activities', 'price_monthly', 
                    existing_type=sa.String(),
                    type_=sa.FLOAT(),
                    postgresql_using='price_monthly::float')