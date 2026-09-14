"""Add DetectionEvent

Revision ID: db80487b3714
Revises: afe8f9e744a2
Create Date: 2026-09-14 19:14:47.669633

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'db80487b3714'
down_revision: Union[str, Sequence[str], None] = 'afe8f9e744a2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table('detection_events',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('camera_id', sa.Integer(), nullable=True),
    sa.Column('vehicle_id', sa.String(), nullable=True),
    sa.Column('detection_class', sa.String(), nullable=True),
    sa.Column('confidence', sa.Float(), nullable=True),
    sa.Column('timestamp', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('latitude', sa.Float(), nullable=True),
    sa.Column('longitude', sa.Float(), nullable=True),
    sa.Column('source', sa.String(), nullable=True),
    sa.Column('is_demo', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['camera_id'], ['cameras.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_detection_events_id'), 'detection_events', ['id'], unique=False)
    op.create_index(op.f('ix_detection_events_vehicle_id'), 'detection_events', ['vehicle_id'], unique=False)

def downgrade() -> None:
    op.drop_index(op.f('ix_detection_events_vehicle_id'), table_name='detection_events')
    op.drop_index(op.f('ix_detection_events_id'), table_name='detection_events')
    op.drop_table('detection_events')
