import { test, expect } from '../base.test'

test('should check if switching from dark to light mode works', async ({ page }) => {
    await page.goto('https://sbecagol.com/test-apps/todo-list/');
    await page.getByRole('button', { name: 'Toggle dark/light mode' }).click();
    await expect(page.locator('body')).toHaveScreenshot('./data/screens/sbecagolToDo/darkMode.png');
    await expect(page.getByRole('region', { name: 'Todo app' })).toHaveScreenshot('./data/screens/sbecagolToDo/darkModeAppRegion.png');
    await page.getByRole('button', { name: 'Toggle dark/light mode' }).click();
    await expect(page.locator('body')).toHaveScreenshot('./data/screens/sbecagolToDo/lightMode.png');
    await expect(page.getByRole('region', { name: 'Todo app' })).toHaveScreenshot('./data/screens/sbecagolToDo/lightModeAppRegion.png');
});

test('should check if it is possible to add 10 tasks to the list mark 5 as and delete two', async ({ sbecagolToDo }) => {
    await sbecagolToDo.goto();
    for (let i = 1; i < 11; i++) {
        await sbecagolToDo.fillToDoTextBox('task' + i);
        await sbecagolToDo.cliclAddButton();
    }

    await expect(await sbecagolToDo.getAllListItems()).toHaveCount(10);
    for (let i = 0; i < 5; i++) {
        await sbecagolToDo.markNthItenAsComplete(i);
    }
    expect(await sbecagolToDo.getAllCompletedItems()).toHaveCount(5);
    expect(await sbecagolToDo.getAllToDoItems()).toHaveCount(10);
    await sbecagolToDo.dleteNthItemFromTheList(6);
    await sbecagolToDo.dleteNthItemFromTheList(7);
    expect(await sbecagolToDo.getAllToDoItems()).toHaveCount(8);
    expect(await sbecagolToDo.getAllCompletedItems()).toHaveCount(5);
});

test('Should validate that "All", "Active" and "Completed" filters work as expected', async ({ sbecagolToDo }) => {
    await sbecagolToDo.goto();
    //add 10 items
    for (let i = 1; i < 11; i++) {
        await sbecagolToDo.fillToDoTextBox('task' + i);
        await sbecagolToDo.cliclAddButton();
    }
    await expect.soft(await sbecagolToDo.getAllListItems()).toHaveCount(10);
    //mark 4 as completed
    for (let i = 0; i < 4; i++) {
        await sbecagolToDo.markNthItenAsComplete(i);
    }
    //check if all stil count 10 items
    await expect.soft(await sbecagolToDo.getAllListItems()).toHaveCount(10);
    //check if active shows 6
    sbecagolToDo.clickActiveFilter();
    await expect.soft(await sbecagolToDo.getAllListItems()).toHaveCount(6);
    //check if completed show 4
    sbecagolToDo.clickCompletedFilter();
    await expect.soft(await sbecagolToDo.getAllListItems()).toHaveCount(4);
});

test('Clearing completed should remove all completed items from the list', async ({ sbecagolToDo }) => {
    await sbecagolToDo.goto();
    //add 10 items
    for (let i = 1; i < 11; i++) {
        await sbecagolToDo.fillToDoTextBox('task' + i);
        await sbecagolToDo.cliclAddButton();
    }
    await expect.soft(await sbecagolToDo.getAllListItems()).toHaveCount(10);
    //mark all 10 completed
    for (let i = 0; i < 10; i++) {
        await sbecagolToDo.markNthItenAsComplete(i);
    }
    await expect.soft(await sbecagolToDo.getAllListItems()).toHaveCount(10);
    await sbecagolToDo.clickClearCompleted();
    await expect.soft(await sbecagolToDo.getAllListItems()).toHaveCount(0);

});

test('Selecting an active filter and clicking complete on the item should remove the item from the list', async ({ page, sbecagolToDo }) => {
    await sbecagolToDo.goto();
    //add 10 items
    for (let i = 1; i < 4; i++) {
        await sbecagolToDo.fillToDoTextBox('task' + i);
        await sbecagolToDo.cliclAddButton();
    }
    await expect.soft(await sbecagolToDo.getAllListItems()).toHaveCount(3);

    for (let i = 0; i < 3; i++) {
        await sbecagolToDo.markNthItenAsComplete(i);
    }
    await sbecagolToDo.clickClearCompleted();
    await expect.soft(await sbecagolToDo.getAllListItems()).toHaveCount(0);
});

// ==================== NEW TESTS - Additional Coverage ====================

test('Should not allow adding empty tasks or tasks with only whitespace', async ({ page, sbecagolToDo }) => {
    await sbecagolToDo.goto();
    
    // Try adding empty task
    await sbecagolToDo.cliclAddButton();
    await expect(await sbecagolToDo.getAllListItems()).toHaveCount(0);
    
    // Try adding task with only spaces
    await sbecagolToDo.fillToDoTextBox('     ');
    await sbecagolToDo.cliclAddButton();
    await expect(await sbecagolToDo.getAllListItems()).toHaveCount(0);
    
    // Try adding task with only tabs
    await sbecagolToDo.fillToDoTextBox('\t\t\t');
    await sbecagolToDo.cliclAddButton();
    await expect(await sbecagolToDo.getAllListItems()).toHaveCount(0);
    
    // Verify a valid task can still be added
    await sbecagolToDo.fillToDoTextBox('Valid task');
    await sbecagolToDo.cliclAddButton();
    await expect(await sbecagolToDo.getAllListItems()).toHaveCount(1);
});

test('Should allow adding tasks using Enter key', async ({ page, sbecagolToDo }) => {
    await sbecagolToDo.goto();
    
    // Add task using Enter key
    await sbecagolToDo.fillToDoTextBox('Task added with Enter');
    await page.getByRole('textbox', { name: 'New todo' }).press('Enter');
    await expect(await sbecagolToDo.getAllListItems()).toHaveCount(1);
    
    // Add another task using Enter key
    await sbecagolToDo.fillToDoTextBox('Another task with Enter');
    await page.getByRole('textbox', { name: 'New todo' }).press('Enter');
    await expect(await sbecagolToDo.getAllListItems()).toHaveCount(2);
    
    // Verify input field is cleared after adding
    await expect(page.getByRole('textbox', { name: 'New todo' })).toHaveValue('');
});

test('Should display accurate counter for total and active tasks', async ({ page, sbecagolToDo }) => {
    await sbecagolToDo.goto();
    
    // Add 5 tasks
    for (let i = 1; i <= 5; i++) {
        await sbecagolToDo.fillToDoTextBox(`Task ${i}`);
        await sbecagolToDo.cliclAddButton();
    }
    
    // Verify counter shows "5 total • 5 active"
    await expect(page.locator('text=5 total • 5 active')).toBeVisible();
    
    // Mark 2 as completed
    await sbecagolToDo.markNthItenAsComplete(0);
    await sbecagolToDo.markNthItenAsComplete(1);
    
    // Verify counter shows "5 total • 3 active"
    await expect(page.locator('text=5 total • 3 active')).toBeVisible();
    
    // Delete one task
    await sbecagolToDo.dleteNthItemFromTheList(0);
    
    // Verify counter updates to "4 total • 3 active"
    await expect(page.locator('text=4 total • 3 active')).toBeVisible();
});

test('Should allow toggling tasks between completed and active states', async ({ page, sbecagolToDo }) => {
    await sbecagolToDo.goto();
    
    // Add a task
    await sbecagolToDo.fillToDoTextBox('Toggle test task');
    await sbecagolToDo.cliclAddButton();
    
    // Mark as complete
    await sbecagolToDo.markNthItenAsComplete(0);
    await expect(await sbecagolToDo.getAllCompletedItems()).toHaveCount(1);
    await expect(page.locator('text=1 total • 0 active')).toBeVisible();
    
    // Toggle back to active
    await sbecagolToDo.markNthItenAsComplete(0);
    await expect(await sbecagolToDo.getAllCompletedItems()).toHaveCount(0);
    await expect(page.locator('text=1 total • 1 active')).toBeVisible();
    
    // Toggle to complete again
    await sbecagolToDo.markNthItenAsComplete(0);
    await expect(await sbecagolToDo.getAllCompletedItems()).toHaveCount(1);
    await expect(page.locator('text=1 total • 0 active')).toBeVisible();
});

test('Should handle very long task descriptions', async ({ page, sbecagolToDo }) => {
    await sbecagolToDo.goto();
    
    const longText = 'This is a very long task description to test how the application handles long text inputs and whether it displays them properly without breaking the layout or causing any UI issues. It should wrap correctly and remain readable.';
    
    await sbecagolToDo.fillToDoTextBox(longText);
    await sbecagolToDo.cliclAddButton();
    
    // Verify task was added
    await expect(await sbecagolToDo.getAllListItems()).toHaveCount(1);
    
    // Verify the full text is present
    await expect(page.locator('.todo').first()).toContainText(longText);
    
    // Verify it can be marked as complete
    await sbecagolToDo.markNthItenAsComplete(0);
    await expect(await sbecagolToDo.getAllCompletedItems()).toHaveCount(1);
    
    // Verify it can be deleted
    await sbecagolToDo.dleteNthItemFromTheList(0);
    await expect(await sbecagolToDo.getAllListItems()).toHaveCount(0);
});

test('Should handle special characters and emojis in task descriptions', async ({ page, sbecagolToDo }) => {
    await sbecagolToDo.goto();
    
    const specialTasks = [
        'Task with emojis 🎉 ✨ 🚀',
        'Task with symbols @#$%^&*()',
        'Task with quotes "double" and \'single\'',
        'Task with <html> tags',
        'Task with numbers 123456789',
    ];
    
    // Add all special tasks
    for (const task of specialTasks) {
        await sbecagolToDo.fillToDoTextBox(task);
        await sbecagolToDo.cliclAddButton();
    }
    
    // Verify all tasks were added
    await expect(await sbecagolToDo.getAllListItems()).toHaveCount(specialTasks.length);
    
    // Verify each task text is displayed correctly
    for (const task of specialTasks) {
        await expect(page.locator('.todo').filter({ hasText: task })).toBeVisible();
    }
});

test('Should properly escape HTML and prevent XSS in task descriptions', async ({ page, sbecagolToDo }) => {
    await sbecagolToDo.goto();
    
    const xssAttempt = '<script>alert("xss")</script>';
    
    await sbecagolToDo.fillToDoTextBox(xssAttempt);
    await sbecagolToDo.cliclAddButton();
    
    // Verify task was added
    await expect(await sbecagolToDo.getAllListItems()).toHaveCount(1);
    
    // Verify the text is displayed as plain text (not executed)
    await expect(page.locator('.todo').first()).toContainText('<script>alert("xss")</script>');
    
    // Ensure no alert was triggered (if it was, the test would likely hang or fail)
    // The presence of the text as plain text confirms proper escaping
});

test('Should maintain correct filter state when deleting tasks', async ({ page, sbecagolToDo }) => {
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
    await expect(await sbecagolToDo.getAllListItems()).toHaveCount(2);
    
    // Switch to Completed filter
    await sbecagolToDo.clickCompletedFilter();
    await expect(await sbecagolToDo.getAllListItems()).toHaveCount(2);
    
    // Delete one completed task
    await sbecagolToDo.dleteNthItemFromTheList(0);
    await expect(await sbecagolToDo.getAllListItems()).toHaveCount(1);
    
    // Switch back to All filter
    await page.getByRole('button', { name: 'All' }).click();
    await expect(await sbecagolToDo.getAllListItems()).toHaveCount(3);
});

test('Should correctly display "All" filter with mixed completed and active tasks', async ({ page, sbecagolToDo }) => {
    await sbecagolToDo.goto();
    
    // Add 6 tasks
    for (let i = 1; i <= 6; i++) {
        await sbecagolToDo.fillToDoTextBox(`Task ${i}`);
        await sbecagolToDo.cliclAddButton();
    }
    
    // Mark every other task as completed (1st, 3rd, 5th)
    await sbecagolToDo.markNthItenAsComplete(0);
    await sbecagolToDo.markNthItenAsComplete(2);
    await sbecagolToDo.markNthItenAsComplete(4);
    
    // Verify All filter shows all 6 tasks
    await expect(await sbecagolToDo.getAllListItems()).toHaveCount(6);
    await expect(await sbecagolToDo.getAllCompletedItems()).toHaveCount(3);
    
    // Switch to Active filter
    await sbecagolToDo.clickActiveFilter();
    await expect(await sbecagolToDo.getAllListItems()).toHaveCount(3);
    
    // Switch back to All filter
    await page.getByRole('button', { name: 'All' }).click();
    await expect(await sbecagolToDo.getAllListItems()).toHaveCount(6);
    
    // Switch to Completed filter
    await sbecagolToDo.clickCompletedFilter();
    await expect(await sbecagolToDo.getAllListItems()).toHaveCount(3);
    
    // Switch back to All filter again
    await page.getByRole('button', { name: 'All' }).click();
    await expect(await sbecagolToDo.getAllListItems()).toHaveCount(6);
});

test('Should display empty state message when no tasks exist', async ({ page, sbecagolToDo }) => {
    await sbecagolToDo.goto();
    
    // Verify empty state message is displayed
    await expect(page.locator('text=No tasks yet. Add one above!')).toBeVisible();
    
    // Add a task
    await sbecagolToDo.fillToDoTextBox('First task');
    await sbecagolToDo.cliclAddButton();
    
    // Verify empty state message is gone
    await expect(page.locator('text=No tasks yet. Add one above!')).not.toBeVisible();
    
    // Delete the task
    await sbecagolToDo.dleteNthItemFromTheList(0);
    
    // Verify empty state message returns
    await expect(page.locator('text=No tasks yet. Add one above!')).toBeVisible();
});

test('Should clear input field after adding a task', async ({ page, sbecagolToDo }) => {
    await sbecagolToDo.goto();
    
    const taskText = 'Task to test input clearing';
    
    // Add a task
    await sbecagolToDo.fillToDoTextBox(taskText);
    await sbecagolToDo.cliclAddButton();
    
    // Verify input field is cleared
    await expect(page.getByRole('textbox', { name: 'New todo' })).toHaveValue('');
    
    // Add another task using Enter key
    await sbecagolToDo.fillToDoTextBox('Another task');
    await page.getByRole('textbox', { name: 'New todo' }).press('Enter');
    
    // Verify input field is cleared again
    await expect(page.getByRole('textbox', { name: 'New todo' })).toHaveValue('');
});
// ==================== END OF NEW TESTS ====================