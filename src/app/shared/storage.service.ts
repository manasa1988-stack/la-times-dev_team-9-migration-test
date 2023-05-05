import { Injectable } from "@angular/core";

@Injectable()
export class StorageService {

    private setObjectValue(key: string, value: any) {
        if (value)
            sessionStorage.setItem(key, JSON.stringify(value));
    }

    private removeObjectValue(key: string) {
        if (key)
            sessionStorage.removeItem(key);
    }

  private getObjectValue(key: string) {
    let item = sessionStorage.getItem(key);
    if (item)
      return JSON.parse(item);
    return null;
  }

  removeAllkeys() {
    sessionStorage.clear();
  }

  setUserInfo(value: Object) {
    this.setObjectValue("USER_INFO", value);
  }

  getUserInfo() {
    return this.getObjectValue("USER_INFO");
  }

  removeUserInfo() {
      this.removeObjectValue("USER_INFO");
  }

  getHOST() {
    return this.getObjectValue("HOST");
  }

  setHOST(value: Object) {
    this.setObjectValue("HOST", value);
  }

  setBrowserSession(value: Object){
    console.log('set browser session : '+ value);
    this.setObjectValue("BROWSER_SESSION", value);
  }

  getBrowserSession() {
    console.log('get browser session');
    return this.getObjectValue("BROWSER_SESSION");
  }

}
