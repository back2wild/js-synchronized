import { synchronized, takeLatest, takeLeading } from '../src';
import { AbandonedCallAction } from '../src/types';

class SomeClass {
  @synchronized()
  public async f1(wait: number) {
    await new Promise((resolve: any) => {
      setTimeout(resolve, wait);
    });
    console.log('synchronized f1-' + wait);
    return wait;
  }

  @synchronized('f2')
  public async f21(wait: number) {
    await new Promise((resolve: any) => {
      setTimeout(resolve, wait);
    });
    console.log('synchronized f21-' + wait);
    return wait;
  }

  @synchronized('f2')
  public async f22(wait: number) {
    await new Promise((resolve: any) => {
      setTimeout(resolve, wait);
    });
    console.log('synchronized f22-' + wait);
    return wait;
  }

  @takeLatest()
  public async last(wait: number) {
    await new Promise((resolve: any) => {
      setTimeout(resolve, wait);
    });
    return wait;
  }
  @takeLeading()
  public async first(wait: number) {
    await new Promise((resolve: any) => {
      setTimeout(resolve, wait);
    });
    return wait;
  }

  @takeLeading()
  @synchronized('combine')
  public async combine1(wait: number) {
    await new Promise((resolve: any) => {
      setTimeout(resolve, wait);
    });
    return wait;
  }

  @synchronized('combine')
  public async combine2(wait: number) {
    await new Promise((resolve: any) => {
      setTimeout(resolve, wait);
    });
    return wait;
  }
}

const obj = new SomeClass();

obj.f1(3000);
obj.f1(2000);
obj.f1(1000);

obj.f21(3000);
obj.f21(2000);
obj.f21(1000);

obj.f22(3000);
obj.f22(2000);
obj.f22(1000);


obj.last(1000).then((r: any) => console.log('last 1000: ' + r));
obj.last(2000).then((r: any) => console.log('last 2000: ' + r));
obj.last(3000).then((r: any) => console.log('last 3000: ' + r));

obj.first(1000).then((r: any) => console.log('first 1000: ' + r));
obj.first(2000).then((r: any) => console.log('first 2000: ' + r));
obj.first(3000).then((r: any) => console.log('first 3000: ' + r));

obj.combine1(1000).then((r: any) => console.log('combine1 1000: ' + r));
obj.combine1(2000).then((r: any) => console.log('combine1 2000: ' + r));
obj.combine2(1000).then((r: any) => console.log('combine2 1000: ' + r));
obj.combine2(2000).then((r: any) => console.log('combine2 2000: ' + r));
