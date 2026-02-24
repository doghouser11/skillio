"""Initial migration

Revision ID: 001
Revises: 
Create Date: 2024-01-01 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID


# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create users table
    op.create_table('users',
        sa.Column('id', UUID(as_uuid=True), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('password_hash', sa.String(), nullable=False),
        sa.Column('role', sa.Enum('parent', 'school', 'admin', name='userrole'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # Create neighborhoods table
    op.create_table('neighborhoods',
        sa.Column('id', UUID(as_uuid=True), nullable=False),
        sa.Column('city', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('lat', sa.Float(), nullable=False),
        sa.Column('lng', sa.Float(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # Create schools table
    op.create_table('schools',
        sa.Column('id', UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('email', sa.String(), nullable=True),
        sa.Column('city', sa.String(), nullable=False),
        sa.Column('address', sa.String(), nullable=True),
        sa.Column('neighborhood_id', UUID(as_uuid=True), nullable=True),
        sa.Column('lat', sa.Float(), nullable=True),
        sa.Column('lng', sa.Float(), nullable=True),
        sa.Column('verified', sa.Boolean(), nullable=True, default=False),
        sa.Column('created_by', UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
        sa.ForeignKeyConstraint(['neighborhood_id'], ['neighborhoods.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create activities table
    op.create_table('activities',
        sa.Column('id', UUID(as_uuid=True), nullable=False),
        sa.Column('school_id', UUID(as_uuid=True), nullable=True),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('category', sa.String(), nullable=False),
        sa.Column('age_min', sa.Integer(), nullable=False),
        sa.Column('age_max', sa.Integer(), nullable=False),
        sa.Column('price_monthly', sa.Float(), nullable=True),
        sa.Column('active', sa.Boolean(), nullable=True, default=True),
        sa.Column('verified', sa.Boolean(), nullable=True, default=False),
        sa.Column('created_by', UUID(as_uuid=True), nullable=False),
        sa.Column('source', sa.Enum('school', 'parent', 'scraped', name='activitysource'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
        sa.ForeignKeyConstraint(['school_id'], ['schools.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create leads table
    op.create_table('leads',
        sa.Column('id', UUID(as_uuid=True), nullable=False),
        sa.Column('activity_id', UUID(as_uuid=True), nullable=False),
        sa.Column('parent_id', UUID(as_uuid=True), nullable=False),
        sa.Column('child_age', sa.Integer(), nullable=False),
        sa.Column('message', sa.Text(), nullable=True),
        sa.Column('status', sa.Enum('new', 'contacted', 'closed', name='leadstatus'), nullable=True, default='new'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['activity_id'], ['activities.id'], ),
        sa.ForeignKeyConstraint(['parent_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create reviews table
    op.create_table('reviews',
        sa.Column('id', UUID(as_uuid=True), nullable=False),
        sa.Column('school_id', UUID(as_uuid=True), nullable=False),
        sa.Column('parent_id', UUID(as_uuid=True), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('comment', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['parent_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['school_id'], ['schools.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('reviews')
    op.drop_table('leads')
    op.drop_table('activities')
    op.drop_table('schools')
    op.drop_table('neighborhoods')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')