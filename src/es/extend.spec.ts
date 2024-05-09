import {Person, Student} from "@/es/extend";

test('class extend', () => {
  const p = new Person();
  const s = new Student();

  console.log('s.getName()', s.getName())
  console.log('s.getMsg()', s.getMsg())
  expect(s instanceof Person).toBe(true);
})
