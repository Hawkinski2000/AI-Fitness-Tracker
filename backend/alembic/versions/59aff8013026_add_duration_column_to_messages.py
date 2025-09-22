"""add duration column to messages

Revision ID: 59aff8013026
Revises: 02645875e8e0
Create Date: 2025-09-21 22:11:48.274461

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '59aff8013026'
down_revision: Union[str, Sequence[str], None] = '02645875e8e0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('message', sa.Column('duration_secs', sa.Integer(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('message', 'duration_secs')
