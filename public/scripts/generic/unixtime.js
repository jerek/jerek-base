JF.unixtime = new function() {
    this.minute = 60;
    this.hour = this.minute * 60;
    this.halfday = this.hour * 12;
    this.day = this.hour * 24;
    this.week = this.day * 7;
    this.month = this.day * 30;
};