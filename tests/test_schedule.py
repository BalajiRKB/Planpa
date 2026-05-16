"""Tests for Planpa schedule generation logic — 40-min work blocks + 5-min breaks."""
from datetime import datetime, timedelta
import math
import pytest


# ── Schedule generation logic (mirrors AppContext behaviour) ───────────────────

WORK_BLOCK_DURATION = 40  # minutes
BREAK_DURATION = 5        # minutes
DEFAULT_BLOCKS = 8


def generate_time_blocks(start_time: datetime, num_work_blocks: int = DEFAULT_BLOCKS):
    """Generate alternating work/break blocks starting at start_time."""
    blocks = []
    current = start_time
    for i in range(num_work_blocks):
        work_end = current + timedelta(minutes=WORK_BLOCK_DURATION)
        blocks.append({
            "blockId": f"work-{i}",
            "blockType": "Work",
            "startTime": current,
            "endTime": work_end,
            "duration": WORK_BLOCK_DURATION,
            "assignedTasks": [],
            "isCompleted": False,
        })
        current = work_end
        if i < num_work_blocks - 1:  # no break after last block
            break_end = current + timedelta(minutes=BREAK_DURATION)
            blocks.append({
                "blockId": f"break-{i}",
                "blockType": "Break",
                "startTime": current,
                "endTime": break_end,
                "duration": BREAK_DURATION,
                "assignedTasks": [],
                "isCompleted": False,
            })
            current = break_end
    return blocks


def assign_task_to_block(blocks: list, block_id: str, task_id: str) -> list:
    """Assign a task ID to a work block."""
    for block in blocks:
        if block["blockId"] == block_id:
            if block["blockType"] != "Work":
                raise ValueError("Cannot assign task to a Break block")
            block["assignedTasks"].append(task_id)
            return blocks
    raise KeyError(f"Block {block_id} not found")


def complete_block(blocks: list, block_id: str) -> list:
    for block in blocks:
        if block["blockId"] == block_id:
            block["isCompleted"] = True
            return blocks
    raise KeyError(f"Block {block_id} not found")


# ── Tests ──────────────────────────────────────────────────────────────────────

class TestGenerateTimeBlocks:
    def setup_method(self):
        self.start = datetime(2025, 11, 14, 9, 0, 0)
        self.blocks = generate_time_blocks(self.start)

    def test_correct_total_block_count(self):
        # 8 work + 7 breaks (no break after last work block)
        assert len(self.blocks) == 15

    def test_first_block_is_work(self):
        assert self.blocks[0]["blockType"] == "Work"

    def test_second_block_is_break(self):
        assert self.blocks[1]["blockType"] == "Break"

    def test_work_block_duration(self):
        work_blocks = [b for b in self.blocks if b["blockType"] == "Work"]
        for b in work_blocks:
            assert b["duration"] == WORK_BLOCK_DURATION

    def test_break_block_duration(self):
        break_blocks = [b for b in self.blocks if b["blockType"] == "Break"]
        for b in break_blocks:
            assert b["duration"] == BREAK_DURATION

    def test_last_block_is_work(self):
        assert self.blocks[-1]["blockType"] == "Work"

    def test_blocks_are_sequential(self):
        for i in range(len(self.blocks) - 1):
            assert self.blocks[i]["endTime"] == self.blocks[i + 1]["startTime"]

    def test_first_block_starts_at_given_time(self):
        assert self.blocks[0]["startTime"] == self.start

    def test_work_block_count(self):
        work_blocks = [b for b in self.blocks if b["blockType"] == "Work"]
        assert len(work_blocks) == DEFAULT_BLOCKS

    def test_break_block_count(self):
        break_blocks = [b for b in self.blocks if b["blockType"] == "Break"]
        assert len(break_blocks) == DEFAULT_BLOCKS - 1

    def test_all_blocks_start_with_empty_tasks(self):
        for b in self.blocks:
            assert b["assignedTasks"] == []

    def test_custom_block_count(self):
        blocks = generate_time_blocks(self.start, num_work_blocks=3)
        work = [b for b in blocks if b["blockType"] == "Work"]
        assert len(work) == 3


class TestAssignTaskToBlock:
    def setup_method(self):
        self.start = datetime(2025, 11, 14, 9, 0, 0)
        self.blocks = generate_time_blocks(self.start)

    def test_assign_task_to_work_block(self):
        assign_task_to_block(self.blocks, "work-0", "task-abc")
        work_block = next(b for b in self.blocks if b["blockId"] == "work-0")
        assert "task-abc" in work_block["assignedTasks"]

    def test_assign_multiple_tasks(self):
        assign_task_to_block(self.blocks, "work-0", "task-1")
        assign_task_to_block(self.blocks, "work-0", "task-2")
        work_block = next(b for b in self.blocks if b["blockId"] == "work-0")
        assert len(work_block["assignedTasks"]) == 2

    def test_cannot_assign_to_break_block(self):
        with pytest.raises(ValueError):
            assign_task_to_block(self.blocks, "break-0", "task-xyz")

    def test_assign_to_nonexistent_block_raises(self):
        with pytest.raises(KeyError):
            assign_task_to_block(self.blocks, "work-99", "task-xyz")


class TestCompleteBlock:
    def setup_method(self):
        self.start = datetime(2025, 11, 14, 9, 0, 0)
        self.blocks = generate_time_blocks(self.start)

    def test_complete_a_block(self):
        complete_block(self.blocks, "work-0")
        block = next(b for b in self.blocks if b["blockId"] == "work-0")
        assert block["isCompleted"] is True

    def test_other_blocks_unaffected(self):
        complete_block(self.blocks, "work-0")
        other = next(b for b in self.blocks if b["blockId"] == "work-1")
        assert other["isCompleted"] is False

    def test_complete_nonexistent_block_raises(self):
        with pytest.raises(KeyError):
            complete_block(self.blocks, "work-99")
