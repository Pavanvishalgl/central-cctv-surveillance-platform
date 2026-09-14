import re

with open("backend/alembic/versions/68519d856d7e_add_watchlist_and_alerts.py", "r") as f:
    content = f.read()

upgrade_content = """def upgrade() -> None:
    op.create_table('watchlist',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('type', sa.Enum('STOLEN_VEHICLE', 'BLACKLISTED_VEHICLE', 'WANTED_PERSON', 'MISSING_PERSON', 'SUSPECT', name='watchlisttypeenum'), nullable=False),
    sa.Column('identifier', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('status', sa.Enum('ACTIVE', 'INACTIVE', 'MAINTENANCE', name='statusenum'), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_watchlist_id'), 'watchlist', ['id'], unique=False)
    op.create_table('alerts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('timestamp', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('camera_id', sa.Integer(), nullable=True),
    sa.Column('watchlist_id', sa.Integer(), nullable=True),
    sa.Column('detection_class', sa.String(), nullable=True),
    sa.Column('confidence', sa.Float(), nullable=True),
    sa.Column('status', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['camera_id'], ['cameras.id'], ),
    sa.ForeignKeyConstraint(['watchlist_id'], ['watchlist.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_alerts_id'), 'alerts', ['id'], unique=False)

def downgrade() -> None:
    op.drop_index(op.f('ix_alerts_id'), table_name='alerts')
    op.drop_table('alerts')
    op.drop_index(op.f('ix_watchlist_id'), table_name='watchlist')
    op.drop_table('watchlist')
    op.execute("DROP TYPE watchlisttypeenum;")
"""

content = re.sub(r'def upgrade\(\) -> None:.*', upgrade_content, content, flags=re.DOTALL)

with open("backend/alembic/versions/68519d856d7e_add_watchlist_and_alerts.py", "w") as f:
    f.write(content)
