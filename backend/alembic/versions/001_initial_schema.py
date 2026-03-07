"""Initial schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-03-07 07:34:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create enum types
    op.execute("CREATE TYPE userrole AS ENUM ('parent', 'school', 'admin')")
    op.execute("CREATE TYPE activitysource AS ENUM ('school', 'parent', 'scraped')")
    op.execute("CREATE TYPE leadstatus AS ENUM ('new', 'contacted', 'closed')")
    op.execute("CREATE TYPE schoolstatus AS ENUM ('pending', 'approved', 'rejected')")

    # Create users table
    op.create_table('users',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('password_hash', sa.String(), nullable=False),
        sa.Column('role', sa.Enum('parent', 'school', 'admin', name='userrole'), nullable=False),
        sa.Column('refresh_token', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # Create neighborhoods table
    op.create_table('neighborhoods',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('city', sa.String(), nullable=False),
        sa.Column('region', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # Create schools table
    op.create_table('schools',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('email', sa.String(), nullable=True),
        sa.Column('website', sa.String(), nullable=True),
        sa.Column('address', sa.Text(), nullable=True),
        sa.Column('neighborhood_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('logo_url', sa.String(), nullable=True),
        sa.Column('status', sa.Enum('pending', 'approved', 'rejected', name='schoolstatus'), server_default='pending', nullable=True),
        sa.Column('created_by_user_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['created_by_user_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['neighborhood_id'], ['neighborhoods.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create activities table
    op.create_table('activities',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('category', sa.String(), nullable=False),
        sa.Column('price_monthly', sa.String(), nullable=True),
        sa.Column('age_min', sa.Integer(), nullable=True),
        sa.Column('age_max', sa.Integer(), nullable=True),
        sa.Column('duration_minutes', sa.Integer(), nullable=True),
        sa.Column('location', sa.Text(), nullable=True),
        sa.Column('school_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('neighborhood_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('source', sa.Enum('school', 'parent', 'scraped', name='activitysource'), server_default='school', nullable=True),
        sa.Column('created_by_user_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['created_by_user_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['neighborhood_id'], ['neighborhoods.id'], ),
        sa.ForeignKeyConstraint(['school_id'], ['schools.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create leads table
    op.create_table('leads',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('parent_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('activity_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('parent_name', sa.String(), nullable=False),
        sa.Column('parent_phone', sa.String(), nullable=True),
        sa.Column('parent_email', sa.String(), nullable=True),
        sa.Column('child_name', sa.String(), nullable=False),
        sa.Column('child_age', sa.Integer(), nullable=True),
        sa.Column('message', sa.Text(), nullable=True),
        sa.Column('status', sa.Enum('new', 'contacted', 'closed', name='leadstatus'), server_default='new', nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['activity_id'], ['activities.id'], ),
        sa.ForeignKeyConstraint(['parent_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create reviews table
    op.create_table('reviews',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('parent_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('activity_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('comment', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['activity_id'], ['activities.id'], ),
        sa.ForeignKeyConstraint(['parent_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('reviews')
    op.drop_table('leads')
    op.drop_table('activities')
    op.drop_table('schools')
    op.drop_table('neighborhoods')
    op.drop_table('users')
    op.execute("DROP TYPE IF EXISTS schoolstatus")
    op.execute("DROP TYPE IF EXISTS leadstatus")
    op.execute("DROP TYPE IF EXISTS activitysource")
    op.execute("DROP TYPE IF EXISTS userrole")