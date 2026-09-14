"""Add name and message

Revision ID: afe8f9e744a2
Revises: 68519d856d7e
Create Date: 2026-09-14 19:04:21.912851

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'afe8f9e744a2'
down_revision: Union[str, Sequence[str], None] = '68519d856d7e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('watchlist', sa.Column('name', sa.String(), nullable=True))
    op.add_column('alerts', sa.Column('message', sa.String(), nullable=True))

def downgrade() -> None:
    op.drop_column('alerts', 'message')
    op.drop_column('watchlist', 'name')
