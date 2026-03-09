"""Add OAuth fields to users table

Revision ID: 002_oauth
Revises: 001
Create Date: 2026-03-09
"""
from alembic import op
import sqlalchemy as sa

revision = '002_oauth'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('users', 'password_hash', existing_type=sa.String(), nullable=True)
    op.add_column('users', sa.Column('auth_provider', sa.String(), nullable=True))


def downgrade():
    op.drop_column('users', 'auth_provider')
    op.alter_column('users', 'password_hash', existing_type=sa.String(), nullable=False)
