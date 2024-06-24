export class Utils {
  static genId() {
    return new Date().getTime() + Math.floor(Math.random() * 1000);
  }
}
