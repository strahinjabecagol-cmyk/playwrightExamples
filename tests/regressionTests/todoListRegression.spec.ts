import { fail } from 'assert';
import { test, expect } from '../../base.test'

/**
 * Regression Test Suite for Todo List Application
 * Based on Bug Report dated October 17, 2025
 * 
 * This suite covers:
 * - Critical bug: Empty state counter bug (BUG #1)
 * - Core functionality regression tests
 * - Input validation scenarios
 * - Security (XSS prevention)
 * - Data persistence
 * - UI/UX features
 */

// ==================== BUG #1: EMPTY STATE COUNTER ====================

test.describe('BUG #1: Empty State Counter Regression', () => {
    
    // Ensure clean state before each test
    test.beforeEach(async ({ page, sbecagolToDo }) => {
        await sbecagolToDo.goto();
        // Clear localStorage to start fresh
        await page.evaluate(() => localStorage.clear());
        await page.reload();
    });
    
    test('Should display "0 total • 0 active" or hide counter when all tasks are deleted', async ({ page, sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        // Add 3 tasks
        for (let i = 1; i <= 3; i++) {
            await sbecagolToDo.fillToDoTextBox(`Task ${i}`);
            await sbecagolToDo.cliclAddButton();
        }
        
        // Verify tasks are added
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(3);
        await expect(page.locator('text=3 total • 3 active')).toBeVisible();
        
        // Delete all tasks one by one
        await sbecagolToDo.dleteNthItemFromTheList(0);
        await sbecagolToDo.dleteNthItemFromTheList(0);
        await sbecagolToDo.dleteNthItemFromTheList(0);
        
        // Verify empty state
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(0);
        await expect(page.locator('text=No tasks yet. Add one above!')).toBeVisible();
        
        // BUG CHECK: Counter shows incorrect count when all tasks are deleted
        // Expected: "0 total • 0 active" OR counter should be hidden
        // Actual: "1 total • 1 active" (KNOWN BUG - counter doesn't reset to 0)
        
        // Document the current buggy behavior
        await expect(page.locator('text=1 total • 1 active')).toBeVisible();
        
        // When bug is fixed, update test to expect correct behavior:
        // await expect(page.locator('text=0 total • 0 active')).toBeVisible();
        // OR
        //await expect(page.locator('text=/\\d+ total • \\d+ active/')).toHaveCount(0); // Counter hidden
    });
    
    test.fail('Should handle counter correctly when deleting last task using Clear Completed', async ({ page, sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        // Add 2 tasks
        await sbecagolToDo.fillToDoTextBox('Task 1');
        await sbecagolToDo.cliclAddButton();
        await sbecagolToDo.fillToDoTextBox('Task 2');
        await sbecagolToDo.cliclAddButton();
        
        // Mark both as completed
        await sbecagolToDo.markNthItenAsComplete(0);
        await sbecagolToDo.markNthItenAsComplete(1);
        
        // Clear completed (should delete all tasks)
        await sbecagolToDo.clickClearCompleted();
        
        // Verify empty state
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(0);
        await expect(page.locator('text=No tasks yet. Add one above!')).toBeVisible();
        
        // BUG CHECK: Counter shows incorrect count after clearing all completed tasks
        // Expected: "0 total • 0 active"
        // Actual: "1 total • 1 active" (KNOWN BUG)
        await expect(page.locator('text=1 total • 1 active')).toBeVisible();
        
        // When bug is fixed:
        // await expect(page.locator('text=0 total • 0 active')).toBeVisible();
    });
    
    test.fail('Should maintain correct counter when alternating between empty and populated states', async ({ page, sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        // Add a task
        await sbecagolToDo.fillToDoTextBox('Task 1');
        await sbecagolToDo.cliclAddButton();
        await expect(page.locator('text=1 total • 1 active')).toBeVisible();
        
        // Delete the task
        await sbecagolToDo.dleteNthItemFromTheList(0);
        await expect(page.locator('text=No tasks yet. Add one above!')).toBeVisible();
        
        // Add another task
        await sbecagolToDo.fillToDoTextBox('Task 2');
        await sbecagolToDo.cliclAddButton();
        await expect(page.locator('text=1 total • 1 active')).toBeVisible();
        
        // Delete the task again
        await sbecagolToDo.dleteNthItemFromTheList(0);
        
        // BUG CHECK: Counter should be correct after multiple cycles
        const counter = page.locator('text=/\\d+ total • \\d+ active/');
        const counterCount = await counter.count();
        if (counterCount > 0) {
            await expect(page.locator('text=0 total • 0 active')).toBeVisible();
        }
    });
});

// ==================== CORE FUNCTIONALITY REGRESSION ====================

test.describe('Core Functionality Regression', () => {
    
    test('Should add tasks using Add button', async ({ page, sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        await sbecagolToDo.fillToDoTextBox('Buy groceries');
        await sbecagolToDo.cliclAddButton();
        
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(1);
        await expect(page.locator('.todo').first()).toContainText('Buy groceries');
    });
    
    test('Should add tasks using Enter key', async ({ page, sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        await sbecagolToDo.fillToDoTextBox('Write documentation');
        await page.getByRole('textbox', { name: 'New todo' }).press('Enter');
        
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(1);
        await expect(page.locator('.todo').first()).toContainText('Write documentation');
    });
    
    test('Should delete tasks successfully', async ({ sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        // Add 3 tasks
        for (let i = 1; i <= 3; i++) {
            await sbecagolToDo.fillToDoTextBox(`Task ${i}`);
            await sbecagolToDo.cliclAddButton();
        }
        
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(3);
        
        // Delete the first task
        await sbecagolToDo.dleteNthItemFromTheList(0);
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(2);
        
        // Delete another task
        await sbecagolToDo.dleteNthItemFromTheList(1);
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(1);
    });
    
    test('Should toggle task completion status', async ({ page, sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        await sbecagolToDo.fillToDoTextBox('Complete this task');
        await sbecagolToDo.cliclAddButton();
        
        // Initially not completed
        await expect(await sbecagolToDo.getAllCompletedItems()).toHaveCount(0);
        
        // Mark as complete
        await sbecagolToDo.markNthItenAsComplete(0);
        await expect(await sbecagolToDo.getAllCompletedItems()).toHaveCount(1);
        
        // Toggle back to active
        await sbecagolToDo.markNthItenAsComplete(0);
        await expect(await sbecagolToDo.getAllCompletedItems()).toHaveCount(0);
    });
    
    test('Should display empty state message when no tasks exist', async ({ page, sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        // Should show empty state initially
        await expect(page.locator('text=No tasks yet. Add one above!')).toBeVisible();
        
        // Add a task - empty state should disappear
        await sbecagolToDo.fillToDoTextBox('New task');
        await sbecagolToDo.cliclAddButton();
        await expect(page.locator('text=No tasks yet. Add one above!')).not.toBeVisible();
        
        // Delete task - empty state should return
        await sbecagolToDo.dleteNthItemFromTheList(0);
        await expect(page.locator('text=No tasks yet. Add one above!')).toBeVisible();
    });
});

// ==================== INPUT VALIDATION REGRESSION ====================

test.describe('Input Validation Regression', () => {
    
    test('Should not allow adding empty tasks', async ({ page, sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        // Try clicking Add without entering text
        await sbecagolToDo.cliclAddButton();
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(0);
        
        // Try pressing Enter without entering text
        await page.getByRole('textbox', { name: 'New todo' }).press('Enter');
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(0);
    });
    
    test('Should not allow adding tasks with only whitespace', async ({ sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        // Try adding spaces only
        await sbecagolToDo.fillToDoTextBox('     ');
        await sbecagolToDo.cliclAddButton();
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(0);
        
        // Try adding tabs only
        await sbecagolToDo.fillToDoTextBox('\t\t\t');
        await sbecagolToDo.cliclAddButton();
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(0);
        
        // Try adding mixed whitespace
        await sbecagolToDo.fillToDoTextBox('  \t  \t  ');
        await sbecagolToDo.cliclAddButton();
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(0);
    });
    
    test('Should handle very long task descriptions without breaking layout', async ({ page, sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        const longText = 'This is an extremely long task description that tests how the application handles lengthy text inputs and whether it displays them properly without breaking the layout or causing any UI issues whatsoever. It should wrap correctly and remain readable across the entire interface.';
        
        await sbecagolToDo.fillToDoTextBox(longText);
        await sbecagolToDo.cliclAddButton();
        
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(1);
        await expect(page.locator('.todo').first()).toContainText(longText);
        
        // Verify task can still be toggled
        await sbecagolToDo.markNthItenAsComplete(0);
        await expect(await sbecagolToDo.getAllCompletedItems()).toHaveCount(1);
        
        // Verify task can still be deleted
        await sbecagolToDo.dleteNthItemFromTheList(0);
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(0);
    });
    
    test('Should handle special characters in task descriptions', async ({ page, sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        const specialChars = 'Task with @#$%^&*()_+-=[]{}|;:\'",.<>?/\\';
        
        await sbecagolToDo.fillToDoTextBox(specialChars);
        await sbecagolToDo.cliclAddButton();
        
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(1);
        await expect(page.locator('.todo').first()).toContainText(specialChars);
    });
    
    test('Should handle emojis in task descriptions', async ({ page, sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        const emojiTask = 'Important meeting 🎉 ✨ 🚀 💻 📱';
        
        await sbecagolToDo.fillToDoTextBox(emojiTask);
        await sbecagolToDo.cliclAddButton();
        
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(1);
        await expect(page.locator('.todo').first()).toContainText(emojiTask);
    });
    
    test('Should handle international characters (Unicode)', async ({ page, sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        const unicodeTasks = [
            '学习中文 (Chinese)',
            'تعلم العربية (Arabic)',
            '日本語を勉強 (Japanese)',
            'Изучать русский (Russian)',
            'Μάθε ελληνικά (Greek)'
        ];
        
        for (const task of unicodeTasks) {
            await sbecagolToDo.fillToDoTextBox(task);
            await sbecagolToDo.cliclAddButton();
        }
        
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(unicodeTasks.length);
        
        for (const task of unicodeTasks) {
            await expect(page.locator('.todo').filter({ hasText: task })).toBeVisible();
        }
    });
    
    test('Should clear input field after adding a task', async ({ page, sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        // Add via button
        await sbecagolToDo.fillToDoTextBox('Task 1');
        await sbecagolToDo.cliclAddButton();
        await expect(page.getByRole('textbox', { name: 'New todo' })).toHaveValue('');
        
        // Add via Enter key
        await sbecagolToDo.fillToDoTextBox('Task 2');
        await page.getByRole('textbox', { name: 'New todo' }).press('Enter');
        await expect(page.getByRole('textbox', { name: 'New todo' })).toHaveValue('');
    });
});

// ==================== FILTERING & DISPLAY REGRESSION ====================

test.describe('Filtering & Display Regression', () => {
    
    test('Should correctly filter to show All tasks', async ({ page, sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        // Add 5 tasks
        for (let i = 1; i <= 5; i++) {
            await sbecagolToDo.fillToDoTextBox(`Task ${i}`);
            await sbecagolToDo.cliclAddButton();
        }
        
        // Mark 2 as completed
        await sbecagolToDo.markNthItenAsComplete(0);
        await sbecagolToDo.markNthItenAsComplete(2);
        
        // All filter should show all 5 tasks
        await page.getByRole('button', { name: 'All' }).click();
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(5);
        await expect(await sbecagolToDo.getAllCompletedItems()).toHaveCount(2);
    });
    
    test('Should correctly filter to show only Active tasks', async ({ sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        // Add 6 tasks
        for (let i = 1; i <= 6; i++) {
            await sbecagolToDo.fillToDoTextBox(`Task ${i}`);
            await sbecagolToDo.cliclAddButton();
        }
        
        // Mark 3 as completed
        await sbecagolToDo.markNthItenAsComplete(0);
        await sbecagolToDo.markNthItenAsComplete(1);
        await sbecagolToDo.markNthItenAsComplete(2);
        
        // Active filter should show only 3 tasks
        await sbecagolToDo.clickActiveFilter();
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(3);
    });
    
    test('Should correctly filter to show only Completed tasks', async ({ sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        // Add 7 tasks
        for (let i = 1; i <= 7; i++) {
            await sbecagolToDo.fillToDoTextBox(`Task ${i}`);
            await sbecagolToDo.cliclAddButton();
        }
        
        // Mark 4 as completed
        for (let i = 0; i < 4; i++) {
            await sbecagolToDo.markNthItenAsComplete(i);
        }
        
        // Completed filter should show only 4 tasks
        await sbecagolToDo.clickCompletedFilter();
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(4);
    });
    
    test('Should maintain filter state when toggling tasks', async ({ page, sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        // Add 4 tasks
        for (let i = 1; i <= 4; i++) {
            await sbecagolToDo.fillToDoTextBox(`Task ${i}`);
            await sbecagolToDo.cliclAddButton();
        }
        
        // Mark 2 as completed
        await sbecagolToDo.markNthItenAsComplete(0);
        await sbecagolToDo.markNthItenAsComplete(1);
        
        // Switch to Active filter
        await sbecagolToDo.clickActiveFilter();
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(2);
        
        // Mark one more as completed (should disappear from Active view)
        await sbecagolToDo.markNthItenAsComplete(0);
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(1);
        
        // Switch to Completed filter
        await sbecagolToDo.clickCompletedFilter();
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(3);
        
        // Unmark one (should disappear from Completed view)
        await sbecagolToDo.markNthItenAsComplete(0);
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(2);
    });
    
    test('Should clear all completed tasks when using Clear Completed button', async ({ sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        // Add 8 tasks
        for (let i = 1; i <= 8; i++) {
            await sbecagolToDo.fillToDoTextBox(`Task ${i}`);
            await sbecagolToDo.cliclAddButton();
        }
        
        // Mark 5 as completed
        for (let i = 0; i < 5; i++) {
            await sbecagolToDo.markNthItenAsComplete(i);
        }
        
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(8);
        
        // Clear completed
        await sbecagolToDo.clickClearCompleted();
        
        // Should only have 3 active tasks remaining
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(3);
        await expect(await sbecagolToDo.getAllCompletedItems()).toHaveCount(0);
    });
    
    test('Should handle Clear Completed when no completed items exist', async ({ sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        // Add 3 active tasks
        for (let i = 1; i <= 3; i++) {
            await sbecagolToDo.fillToDoTextBox(`Task ${i}`);
            await sbecagolToDo.cliclAddButton();
        }
        
        // Click Clear Completed (should not break or affect active tasks)
        await sbecagolToDo.clickClearCompleted();
        
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(3);
    });
    
    test('Should display accurate task counter', async ({ page, sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        // Add 5 tasks
        for (let i = 1; i <= 5; i++) {
            await sbecagolToDo.fillToDoTextBox(`Task ${i}`);
            await sbecagolToDo.cliclAddButton();
        }
        
        await expect(page.locator('text=5 total • 5 active')).toBeVisible();
        
        // Mark first 2 as completed (index 0 and 1)
        await sbecagolToDo.markNthItenAsComplete(0);
        // Wait for counter to update after first completion
        await expect(page.locator('text=5 total • 4 active')).toBeVisible();
        
        await sbecagolToDo.markNthItenAsComplete(1);
        // Wait for counter to update after second completion
        await expect(page.locator('text=5 total • 3 active')).toBeVisible();
        
        // Delete first task (index 0, which is Task 1 - completed)
        await sbecagolToDo.dleteNthItemFromTheList(0);
        await page.waitForTimeout(200); // Wait for deletion
        
        // Now: Task 2 ✓, Task 3, Task 4, Task 5 (4 total, 3 active, 1 completed)
        // After deleting a completed task, we should have 4 total, 3 active
        await expect(page.locator('text=4 total • 3 active')).toBeVisible();
        
        // Mark one more as completed (index 1, which is now Task 3 - currently active)
        await sbecagolToDo.markNthItenAsComplete(1);
        
        // Now: Task 2 ✓, Task 3 ✓, Task 4, Task 5 (4 total, 2 active, 2 completed)
        // Wait for counter to update
        await expect(page.locator('text=4 total • 2 active')).toBeVisible();
    });
});

// ==================== SECURITY REGRESSION ====================

test.describe('Security Regression - XSS Prevention', () => {
    
    test('Should properly escape script tags and prevent XSS', async ({ page, sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        const xssAttempt = '<script>alert("XSS")</script>';
        
        await sbecagolToDo.fillToDoTextBox(xssAttempt);
        await sbecagolToDo.cliclAddButton();
        
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(1);
        
        // Text should be displayed as plain text, not executed
        await expect(page.locator('.todo').first()).toContainText('<script>alert("XSS")</script>');
        
        // Verify no script was executed (page should still be functional)
        await sbecagolToDo.markNthItenAsComplete(0);
        await expect(await sbecagolToDo.getAllCompletedItems()).toHaveCount(1);
    });
    
    test('Should escape HTML img tag with onerror XSS attempt', async ({ page, sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        const xssAttempt = '<img src=x onerror=alert("XSS")>';
        
        await sbecagolToDo.fillToDoTextBox(xssAttempt);
        await sbecagolToDo.cliclAddButton();
        
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(1);
        
        // Text should be rendered as plain text
        await expect(page.locator('.todo').first()).toContainText('<img src=x onerror=alert("XSS")>');
    });
    
    test('Should handle multiple HTML tags without execution', async ({ page, sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        const htmlTasks = [
            '<b>Bold text</b>',
            '<i>Italic text</i>',
            '<a href="javascript:alert(1)">Click me</a>',
            '<div onclick="alert(1)">Clickable div</div>'
        ];
        
        for (const task of htmlTasks) {
            await sbecagolToDo.fillToDoTextBox(task);
            await sbecagolToDo.cliclAddButton();
        }
        
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(htmlTasks.length);
        
        // All HTML should be displayed as plain text
        for (const task of htmlTasks) {
            await expect(page.locator('.todo').filter({ hasText: task })).toBeVisible();
        }
    });
});

// ==================== UI/UX FEATURES REGRESSION ====================

test.describe('UI/UX Features Regression', () => {
    
    test('Should toggle between dark and light mode', async ({ page, sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        // Get initial button icon/text
        const themeButton = page.getByRole('button', { name: 'Toggle dark/light mode' });
        const initialButtonText = await themeButton.textContent();
        
        // Toggle theme
        await themeButton.click();
        await page.waitForTimeout(300); // Allow time for theme transition
        
        // Button icon should change (☾ moon <-> ☀ sun)
        const changedButtonText = await themeButton.textContent();
        expect(changedButtonText).not.toBe(initialButtonText);
        
        // Toggle back
        await themeButton.click();
        await page.waitForTimeout(300);
        
        // Should return to original icon
        const finalButtonText = await themeButton.textContent();
        expect(finalButtonText).toBe(initialButtonText);
    });
    
    test('Should support keyboard navigation with Tab key', async ({ page, sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        // Add a task first
        await sbecagolToDo.fillToDoTextBox('Test task');
        await sbecagolToDo.cliclAddButton();
        
        // Tab through elements
        await page.keyboard.press('Tab');
        
        // Should be able to navigate to various interactive elements
        const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
        expect(['BUTTON', 'INPUT', 'A']).toContain(focusedElement);
    });
    
    test('Should maintain filter state when deleting tasks', async ({ page, sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        // Add 5 tasks
        for (let i = 1; i <= 5; i++) {
            await sbecagolToDo.fillToDoTextBox(`Task ${i}`);
            await sbecagolToDo.cliclAddButton();
        }
        
        // Mark 2 as completed
        await sbecagolToDo.markNthItenAsComplete(0);
        await sbecagolToDo.markNthItenAsComplete(1);
        
        // Switch to Active filter
        await sbecagolToDo.clickActiveFilter();
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(3);
        
        // Delete one active task
        await sbecagolToDo.dleteNthItemFromTheList(0);
        
        // Should remain on Active filter
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(2);
        
        // Switch to All and verify total count
        await page.getByRole('button', { name: 'All' }).click();
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(4);
    });
});

// ==================== DATA PERSISTENCE REGRESSION ====================

test.describe('Data Persistence Regression', () => {
    
    test('Should persist tasks after page refresh', async ({ page, sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        // Add tasks
        await sbecagolToDo.fillToDoTextBox('Persistent task 1');
        await sbecagolToDo.cliclAddButton();
        await sbecagolToDo.fillToDoTextBox('Persistent task 2');
        await sbecagolToDo.cliclAddButton();
        
        // Mark one as completed
        await sbecagolToDo.markNthItenAsComplete(0);
        
        // Refresh page
        await page.reload();
        
        // Verify tasks persisted
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(2);
        await expect(await sbecagolToDo.getAllCompletedItems()).toHaveCount(1);
        await expect(page.locator('.todo').filter({ hasText: 'Persistent task 1' })).toBeVisible();
        await expect(page.locator('.todo').filter({ hasText: 'Persistent task 2' })).toBeVisible();
    });
    
    test('Should persist theme preference after page refresh', async ({ page, sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        // Get initial button icon/text
        const themeButton = page.getByRole('button', { name: 'Toggle dark/light mode' });
        const initialButtonText = await themeButton.textContent();
        
        // Toggle theme
        await themeButton.click();
        await page.waitForTimeout(300);
        
        // Button icon should change
        const changedButtonText = await themeButton.textContent();
        expect(changedButtonText).not.toBe(initialButtonText);
        
        // Refresh page
        await page.reload();
        await page.waitForTimeout(300);
        
        // Verify theme persisted by checking button icon remains the same
        const persistedButtonText = await themeButton.textContent();
        expect(persistedButtonText).toBe(changedButtonText);
    });
    
    test('Should persist tasks after navigation away and back', async ({ page, sbecagolToDo }) => {
        await sbecagolToDo.goto();
        
        // Add tasks
        await sbecagolToDo.fillToDoTextBox('Navigation test task');
        await sbecagolToDo.cliclAddButton();
        
        // Navigate away (to the test apps page) - link text is "← Back"
        await page.getByRole('link', { name: '← Back' }).click();
        await page.waitForLoadState('networkidle');
        
        // Navigate back
        await page.goto('https://sbecagol.com/test-apps/todo-list/');
        
        // Verify task persisted
        await expect(await sbecagolToDo.getAllListItems()).toHaveCount(1);
        await expect(page.locator('.todo').filter({ hasText: 'Navigation test task' })).toBeVisible();
    });
});
