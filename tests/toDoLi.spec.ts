import { test } from "../base.test";

const timeout = 0.5;
test('test', async ({ toDoLiBasePage }) => {
  await toDoLiBasePage.goto();
  await toDoLiBasePage.waitForSeconds(timeout);
  await toDoLiBasePage.addAnItem('test1');
  await toDoLiBasePage.addAnItem('test2');
  await toDoLiBasePage.addAnItem('test3');
  await toDoLiBasePage.addAnItem('more test');
  await toDoLiBasePage.addAnItem('test qaz');
  await toDoLiBasePage.checkItemAsDone('test1');
  await toDoLiBasePage.checkItemAsDone('test2');
  await toDoLiBasePage.checkItemAsDone('test2');
  await toDoLiBasePage.clickActiveLink();
  await toDoLiBasePage.clickCompletedLink();
  await toDoLiBasePage.clickClear();
  await toDoLiBasePage.clickAll();
  await toDoLiBasePage.clickX();
  await toDoLiBasePage.clickCheckbox();

});