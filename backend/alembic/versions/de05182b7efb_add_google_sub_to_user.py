"""add google_sub to user

Revision ID: de05182b7efb
Revises: fc9533245e47
Create Date: 2026-01-17 06:49:49.168533

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'de05182b7efb'
down_revision: Union[str, Sequence[str], None] = 'fc9533245e47'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('user', sa.Column('google_sub', sa.String(), nullable=True))
    op.alter_column('user', 'password_hash',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.create_index(op.f('ix_user_google_sub'), 'user', ['google_sub'], unique=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_user_google_sub'), table_name='user')
    op.alter_column('user', 'password_hash',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.drop_column('user', 'google_sub')
