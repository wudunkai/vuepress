---
date: 2021-07-07
category:
  - JavaScript
tag:
  - JavaScript
  - TypeScript
---

# TypeScript 基础介绍

TypeScript 是 JavaScript 的超集，遵循最新的 es6、es5 规范。TypeScript 扩展了 JavaScript 的语法。

<!-- more -->

![](/javascript/typescript/bg1.png)

## 1.TypeScript 中的数据类型

```ts
// 布尔类型（boolean）
let bool: boolean = false;

// 数字类型（number）
let num: number = 666;

// 字符串类型（string）
let str: string = "字符";

// 数组类型（array）
let arr1: number[] = [112, 23];
let arr2: Array<number> = [112, 23];
let arr1: string[] = ["112", "23"];
let arr2: Array<string> = ["112", "23"];
let arr3: any[] = ["112", 23, true];

// 元组类型（tuple）
let arr: [string, number, boolean] = ["123", 23, false];

// 枚举类型（enum）
enum Flag {
  success = 1,
  error = 0,
}
var f: Flag = Flag.success;
console.log(f); // 1
console.log(Flag.error); // 0
enum Color {
  red,
  blue,
  orange,
}
var c: Color = Color.orange;
console.log(c); // 2
enum Color {
  red,
  blue = 5,
  orange,
}
var c: Color = Color.orange;
console.log(c); // 6

// 任意类型（any）
let any: any = 123;
any = "123";

// null 和 undefined
let num: undefined;
console.log(num); //undefined
let num: number | undefined;
console.log(num); // 定义没有赋值就是undefined
num = 123;
console.log(num); // 123
let num: null;
num = null;
let num: null | undefined | number;

// void 类型 表示没有任何类型
function run(): void {
  console.log("run");
}
run();
function run1(): number {
  return 123;
}
run1();

// never 类型:是其他类型（包括 null 和 undefined）的子类型，代表从不会出现的值。
let a: undefined;
a = undefined;
let b: null;
b = null;
let a: never;
// a = 123; //错误
a = (() => {
  throw new Error("错误");
})();
```

![](/javascript/typescript/bg2.png)

## 2.TypeScript 中的函数

```ts
// 函数定义
// 函数声明发;
function run(): string {
  return "run";
}
// 匿名函数
let run1 = (): string => {
  return "run";
};
//没有返回的值
function run3(): void {
  console.log("run");
}

// 可选参数
// 定义方法参数
let run2 = (name: string, age: number): string => {
  return `名字${name}年龄${age}`;
};
run2("WuWu", 20);

// 默认参数
// 定义方法默认参数
let run2 = (name?: string, age: number = 20): string => {
  return `名字${name}年龄${age}`;
};
// run2("张三");
run2("张三", 32);

// 剩余参数
// 定义方法参数
// let run2 = (a: number, b: number, c: number, d: number): number => {
// return a + b + c + d;
//};
// let run2 = (...result: number[]): number => {
//  let sun = 0;
//  for (let i = 0; i < result.length; i++) {
//    sun += result[i];
//  }
//  return sun;
//};
let run2 = (a: number, ...result: number[]): number => {
  let sun = a;
  for (let i = 0; i < result.length; i++) {
    sun += result[i];
  }
  return sun;
};
run2(1, 2, 3, 4);

// 函数重载
//es5 中遇到同名方法，下面的会替换上面的方法
// function css(config) {}
// function css(config, value) {}
//ts
function getInfo(name: string): string;
function getInfo(name: string, age: number): string;
function getInfo(name: any, age?: any): any {
  if (age) {
    return "名字" + name + "年龄" + age;
  } else {
    return "名字" + name;
  }
}
getInfo("张三"); // 正确
getInfo("张三", 20); // 正确
getInfo(true); // 错误写法
//也是一样替换上面的方法,但是会

// 箭头函数 this 指向的问题 箭头函数里面的 this 指向上下文
setTimeout(() => {}, 100);
```

![](/javascript/typescript/bg3.png)

## 3.TypeScript 的类

```ts
// 类的定义;
//class Person{
//  name: string;
//  constructor(n:string){
//    this.name = n
//  }
//  run ():void{
//    console.log(this.name) // 张三
//  }
//}
//const p = new Person('张三');
//p.run()
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  getName(): string {
    return this.name;
  }
  setName(name: string): void {
    this.name = name;
  }
}
const p = new Person("张三");
p.getName(); // 张三
p.setName("李四");
p.getName(); // 李四

// 类的继承
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  run(): string {
    return `${this.name}在运动`;
  }
}
//const p = new Person('张三');
//p.run() // 张三在运动
class Web extends Person {
  constructor(name: string) {
    super(name);
  }
  work(): string {
    return `${this.name}在工作`;
  }
  // 去掉这个方法，将调用 继承构造函数的方法
  run(): string {
    return `${this.name}在运动-子类`;
  }
}
const w = new Web("李四");
w.run(); //李四在运动-子类
w.work(); // 李四在工作

// 类的里面的修饰符 三种修饰符
// `属性如果不加修饰符，默认公用`
// 1.public 公用  在类里面、子类、类外面都可以访问
class Person {
  public name: string; //公用属性
  constructor(name: string) {
    this.name = name;
  }
  run(): string {
    return `${this.name}在运动`;
  }
}
const p = new Person("张三");
p.run(); // 张三在运动
p.name; // 类外部访问公有属性
// 2.protected 保护类型 在类里面、子类里都可以访问 在类外部没法访问
class Person {
  protected name: string; //公用属性
  constructor(name: string) {
    this.name = name;
  }
  run(): string {
    return `${this.name}在运动`;
  }
}
const p = new Person("张三");
p.run(); // 张三在运动
p.name; // 类外部访问不了公有属性  报错
// 3.private 私有 在类里面可以访问，子类、类外部面都没法访问
class Person {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }
}
class Web extends Person {
  constructor(name: string) {
    super(name);
  }
  // 只能在Person里面访问
  work(): string {
    return `${this.name}在工作`;
  }
  // 只能在Person里面访问
  run(): string {
    return `${this.name}在运动-子类`;
  }
}
const w = new Web("李四");

// 静态属性 静态方法
class Person {
  public name: string; //公用属性
  public age: number = 20; //公用属性
  static sex: string = "男"; //静态属性
  constructor(name: string) {
    this.name = name;
  }
  run(): string {
    //实例方法
    return `${this.name}在运动`;
  }
  work(): string {
    return `${this.name}在工作`;
  }
  static print() {
    // 静态方法 里面没法直接调用类里面的属性 报错
    alert("print方法" + Person.sex);
  }
}
const p = new Person("张三");
p.run(); // 张三在运动
Person.print();

// 多态: 父类定义一个方法不去实现，让继承它的子类去实现，每一个子类有不同的表现
// 多态属性继承
class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  eat(): string {
    console.log("吃的方法");
  }
}
class Dog extends Animal {
  constructor(name: string) {
    super(name);
  }
  eat(): string {
    return `${this.name}吃肉`;
  }
}
class Cat extends Animal {
  constructor(name: string) {
    super(name);
  }
  eat(): string {
    return `${this.name}吃鱼`;
  }
}
const d = new Dog("小狗");
const c = new Dog("小猫");
console.log(d.eat(), c.eat());
//每一个子类继承eat重写eat方法就是多态

//抽象类，它是提供其他类继承的基类，不能直接被实例用 abstract 关键字定义抽象和抽象方法，抽象类中的抽象方法不包含具体实现并且必须在派生类中实现
// abstract抽象方法只能放在抽象类里面
// 抽象类和抽象方法用来定义标准 标准：Animal这个类要求它的子类必须包含eat方法
abstract class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  // 抽象类的子类必须实现抽象类里面的抽象方法 不包含具体实现
  abstract eat(): any;
  // 这个子类不需要实例化
  run(): string {
    //实例方法
    return `${this.name}在运动`;
  }
}
// const a = new Animal(); // 报错
class Dog extends Animal {
  constructor(name: string) {
    super(name);
  }
  // 抽象类的子类必须实现抽象类里面的抽象方法
  eat(): string {
    return `${this.name}吃肉`;
  }
}
const d = new Dog("小狗");
console.log(d.eat());
```

![](/javascript/typescript/bg4.png)

## 4.TypeScript 属性的接口

接口的作用，在面向对象的编程中，接口是一种规范的定义，它定义了行为和动作的规范，在程序设计里面，接口起到一种限制和规范作用，接口定义了某一批类所需要遵守的规范，接口不关心这些类的内部状态数据，也不关心这些类里面方法的实现细节，它只规定这批类里必须提供某些方法，提供这些方法的类就可以满足实际需要。typescript 中的接口类似于 java，同时还增加了更灵活的接口类型，包括属性、函数、可索引和类等。

```ts
// 属性类接口
interface labelInfo {
  name: string;
  age: number;
}
function printLabel(labelInfo: labelInfo): void {
  console.log(`我叫${labelInfo.name},年龄${labelInfo.age}`);
}
// 传入的参数必须包含name age
let obj = { name: "张三", age: 20, sex: "男" };
printLabel(obj);
// 批量方法进行约束
printLabel({ name: "李四", age: 20 });

// 1.可选属性
interface labelInfo {
  name: string;
  // 可选择不传改参数
  age?: number;
}
function printLabel(labelInfo: labelInfo): void {
  console.log(`我叫${labelInfo.name},年龄${labelInfo.age}`);
}
// 参数的顺序可以不一样
printLabel({ age: 20, name: "张三" });
printLabel({ name: "李四" });

// 2.案例
interface Config {
  type: string;
  url: string;
  data?: string;
  dataType: string;
}
function ajax(config: Config) {
  let xhr = new XMLHttpRequest();
  xhr.open(config.type, config.url, true);
  xhr.send(config.data);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      console.log("成功");
      if (config.dataType == "json") {
        console.log(JSON.parse(xhr.responseText));
      } else {
        console.log(xhr.responseText);
      }
    }
  };
}
ajax({
  type: "get",
  url: "http://a.itying.com/api/productlist",
  dataType: "json",
});

// 函数类型接口:对方法传入的参数，以及返回值进行约束
//加密的函数类型接口
interface encrypt {
  (key: string, value: string): string;
}
let md5: encrypt = (key: string, value: string): string => {
  return key + value;
};
md5("name", "info");

// 可索引接口:数组、对象的约束
// 对数组的约束
interface UserArr {
  [index: number]: string | number;
}
let arr1: UserArr = ["1", "2", 3];
// 对对象的约束
interface UserObj {
  [index: string]: string;
}
let arr2: UserObj = { name: "20" };

// 类类型接口:对类的约束和抽象类有点相似
interface Animal {
  name: string;
  eat(val: string): void;
}
class Person implements Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  eat() {
    console.log(this.name + "在运动");
  }
  work(work: string) {
    console.log(this.name + work);
  }
}
let d = new Person("张三");
d.eat();
d.work("在工作");

// 接口扩展:接口可以继承接口
interface Animal {
  eat(): void;
}
interface Person extends Animal {
  work(): void;
}
class Programmer {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  coding(code: string) {
    console.log(this.name + code);
  }
}
class Web extends Programmer implements Person {
  constructor(name: string) {
    super(name);
  }
  eat() {
    console.log(this.name + "吃饭");
  }
  work() {
    console.log(this.name + "工作");
  }
}
let w = new Web("张三");
```

![](/javascript/typescript/bg5.png)

## 5.TypeScript 中的泛型

泛型就是解决类、接口、方法的复用性、以及对不特定的数据类型的支持

any 放弃了类型检测

```ts
// 传入什么参数类型和返回的参数类型一致
// 泛型:可以支持不特定的属性类型
function getData<T>(value: T): T {
  return value;
}
getData < number > 123;
getData < string > "泛型";

// 泛型类
class MinClass<T> {
  list: T[] = [];
  add(num: T): void {
    this.list.push(num);
  }
  min(): T {
    let minNum = this.list[0];
    for (let i = 0; i < this.list.length; i++) {
      if (minNum > this.list[i]) {
        minNum = this.list[i];
      }
    }
    return minNum;
  }
}
// 实例化类 并且制定了类的T代表的类型是number
let m = new MinClass<number>();
m.add(2);
m.add(3);
m.add(1);
m.min();
let w = new MinClass<string>();
w.add("2");
w.add("3");
w.add("1");
w.min();

// 泛接口
// 函数类型接口
interface ConfigFn {
  (value1: string, value2: string): string;
}
let setData: ConfigFn = function (value1: string, value2: string): string {
  return value1 + value2;
};
setData("name", "info");
//泛型接口
// 第一种
interface ConfigFn {
  <T>(value: T): T;
}
let setData: ConfigFn = function <T>(value: T): T {
  return value;
};
setData<string>("name");
// 第二种写法
interface ConfigFn<T> {
  (value: T): T;
}
function getData<T>(value: T): T {
  return value;
}
let myData: ConfigFn<string> = getData;
myData("20");

// 定义一个User的类这个类的作用就是映射数据库字段然后定义一个MysqlDb的类
// 这个类用于操作数据库然后把User类作为参数传入到MysqlDb中
class User {
  username: string | undefined;
  password: string | undefined;
}
class MysqlDb {
  add(user: User): boolean {
    return true;
  }
}
let u = new User();
u.username = "张三";
u.password = "123456";
let Db = new MysqlDb();
Db.add(u);
// 泛型
class MysqlDb<T> {
  add(user: T): boolean {
    return true;
  }
  set(user: T, id: number): boolean {
    return true;
  }
}
class User {
  username: string | undefined;
  password: string | undefined;
}
let u = new User();
u.username = "张三";
u.password = "123456";
let Db1 = new MysqlDb<User>();
Db1.add(u);
// Db1.add('312321'); // 报错
let Db2 = new MysqlDb<User>();
Db2.set(u, 1);

// 使用 typescript 类型、接口、类、泛型综合使用练习
interface DBI<T> {
  add(info: T): boolean;
  update(info: T, id: number): boolean;
  delete(id: number): boolean;
  get(id: number): any[];
}
class MysqlDb<T> implements DBI<T> {
  add(info: T): boolean {
    throw new Error("Method not implemented.");
  }
  update(info: T, id: number): boolean {
    throw new Error("Method not implemented.");
  }
  delete(id: number): boolean {
    throw new Error("Method not implemented.");
  }
  get(id: number): any[] {
    throw new Error("Method not implemented.");
  }
}
class User {
  username: string | undefined;
  password: string | undefined;
}
let u = new User();
u.username = "张三";
u.password = "123";
let oMysql = new MysqlDb<User>();
oMysql.add(u);
```

![](/javascript/typescript/bg6.png)

## 6.TypeScript 中的模块

```ts
// es6 模块化
// db.ts
let dbUrl = "xxxx";
function getData(): any[] {
  return [{ title: 1 }, { title: 2 }];
}
export { dbUrl, getData };
// index.ts
import { getData as get } from "./db";
get();

// 模块化
// db.ts
interface DBI<T> {
  add(info: T): boolean;
  update(info: T, id: number): boolean;
  delete(id: number): boolean;
  get(id: number): any[];
}
export class MysqlDb<T> implements DBI<T> {
  add(info: T): boolean {
    throw new Error("Method not implemented.");
  }
  update(info: T, id: number): boolean {
    throw new Error("Method not implemented.");
  }
  delete(id: number): boolean {
    throw new Error("Method not implemented.");
  }
  get(id: number): any[] {
    throw new Error("Method not implemented.");
  }
}

// user.ts
import { MysqlDb } from "./db";
class User {
  username: string | undefined;
  password: string | undefined;
}
const oMysql = new MysqlDb<User>();
export { User, oMysql };

// index.ts
import { oMysql, User } from "./user";
let u = new User();
u.username = "张三";
u.password = "123";
oMysql.add(u);
```

![](/javascript/typescript/bg7.png)

## 7.TypeScript 命名空间

```ts
// 内部模块:内部模块,主要用于组织代码,避免命名冲突
// 命名空间
namespace A {
  interface Animal {
    name: string;
    eat(val: string): void;
  }
  export class Person implements Animal {
    name: string;
    constructor(name: string) {
      this.name = name;
    }
    eat() {
      console.log(this.name + "在运动");
    }
    work(work: string) {
      console.log(this.name + work);
    }
  }
}
let d = new A.Person("张三");
d.eat();
d.work("在工作");

// 命名空间模块化

// 命名空间
// index.ts
export namespace A {
  interface Animal {
    name: string;
    eat(val: string): void;
  }
  export class Person implements Animal {
    name: string;
    constructor(name: string) {
      this.name = name;
    }
    eat() {
      console.log(this.name + "在运动");
    }
    work(work: string) {
      console.log(this.name + work);
    }
  }
}

import { A } from "./index";
let d = new A.Person("张三");
d.eat();
d.work("在工作");
```

![](/javascript/typescript/bg8.png)

## 8.TypeScript 装饰器

```ts
// 装饰器是一种特殊类型的声明，它能够附加到类声明，方法。属性参数上，可以修改类的行为。
function logClass(params: any) {
  // console.log(params);
  params.prototype.apiUrl = params;
}
@logClass
class HttpClient {
  constructor() {}
  getData() {}
}
let http: any = new HttpClient();
console.log(http.apiUrl);
// 类装饰器:装饰器工厂(可传参)
function logClass(params: string) {
  return function (target: any) {
    console.log(params);
    console.log(target);
    target.prototype.apiUrl = params;
  };
}
@logClass("https://www.baidu.com")
class HttpClient {
  constructor() {}
  getData() {}
}
let http: any = new HttpClient();
console.log(http.apiUrl);
// 类装饰器
// 重载构造函数
function logClass(target: any) {
  return class extends target {
    apiUrl: any = "我是装饰器里面的apiUrl";
    getData() {
      this.apiUrl = this.apiUrl + "---";
      console.log(this.apiUrl);
    }
  };
}
@logClass
class HttpClient {
  apiUrl: string | undefined;
  constructor() {
    this.apiUrl = "我是构造函数里面的apiUrl";
  }
  getData() {
    console.log(this.apiUrl);
  }
}
let http: any = new HttpClient();
console.log(http.apiUrl);

// 1.属性装饰器
// 属性装饰器表达式在运行时当作函数被调用
// 装饰器
function logClass(params: string) {
  return function (target: any) {
    console.log(params);
    console.log(target);
    //target.prototype.apiUrl = params;
  };
}
//@logClass("xxxx")
// 属性装饰器
function logProperty(params: any) {
  return function (target: any, attr: any) {
    // console.log(target);
    // console.log(attr);
    target[attr] = params;
  };
}
class HttpClient {
  // 必须放在属性的上面
  @logProperty("https://www.baidu.com")
  apiUrl: any | undefined;
  constructor() {}
  getData() {
    console.log(this.apiUrl);
  }
}
let http: any = new HttpClient();
http.getData();

// 2.方法装饰器
// 方法装饰器
function get(params: any) {
  return function (target: any, methodName: any, desc: any) {
    target.api = "xxx";
    target.run = function () {
      console.log("run");
    };
    target[methodName];
  };
}
class HttpClient {
  apiUrl: any | undefined;
  constructor() {}
  @get("https://www.baidu.com")
  getData() {
    console.log(this.apiUrl);
  }
}
const http: any = new HttpClient();
http.run();
console.log(http.api);
// 方法装饰器
function get(params: any) {
  return function (target: any, methodName: any, desc: any) {
    let oMethod = desc.value;
    desc.value = function (...args: any[]) {
      args = args.map((value) => {
        return String(value);
      });
      oMethod.apply(this, args);
    };
  };
}
class HttpClient {
  apiUrl: any | undefined;
  constructor() {}
  //必须要放在当前方法上面 方法装饰器
  @get("https://www.baidu.com")
  getData(...args: any[]) {
    console.log(args);
    console.log("我是一个方法");
  }
}
const http: any = new HttpClient();
http.getData("张三", 20);
// 方法参数装饰器
function get(params: any) {
  return function (target: any, methodName: any, desc: any) {
    target.apiUrl = params;
  };
}
class HttpClient {
  apiUrl: any | undefined;
  constructor() {}
  //必须要放在当前方法上面 方法装饰器
  @get("https://www.baidu.com")
  getData(@get("方法参数装饰器") uuid: any) {
    console.log("我是一个" + uuid);
  }
}
const http: any = new HttpClient();
http.getData("方法");

//3.类、属性、方法
function logClass1(params: string) {
  return function (target: any) {
    console.log("类装饰器1");
  };
}
function logClass2(params: string) {
  return function (target: any) {
    console.log("类装饰器2");
  };
}
function logAttribute(params?: string) {
  return function (target: any, attr: any) {
    console.log("属性装饰器1");
  };
}
function logMethod(params?: string) {
  return function (target: any, methodName: any, desc: any) {
    console.log("方法装饰器1");
  };
}
function LogParams1(params?: string) {
  return function (target: any, methodName: any, desc: any) {
    console.log("方法参数装饰器1");
  };
}
function LogParams2(params?: string) {
  return function (target: any, methodName: any, desc: any) {
    console.log("方法参数装饰器2");
  };
}
@logClass1("https://www.baidu.com")
@logClass2("xxx")
class HttpClient {
  @logAttribute()
  api: any | undefined;
  constructor() {}
  @logMethod()
  getData() {
    return true;
  }
  setData(@LogParams1() attr1: any, @LogParams2() attr2: any) {}
}
let http: any = new HttpClient();
// 属性 - 方法 - 方法参数 - 类
// 如果有多个同样的装饰器，它会先执行后面的
```
