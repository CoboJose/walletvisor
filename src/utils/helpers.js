const helpers = {

    //DATES
    timestampToStringDate: function(timestamp){
        return new Date(timestamp).toISOString().slice(0,10);
    },

    stringDatetoTimeStamp: function(date){
        return new Date(date).getTime();
    },
    
    getCurrentStringDate: function(){
        return this.timestampToStringDate(new Date().getTime());
    },

    //MATH
    round: function(number, decimals) {
        return Number(Math.round(number + 'e+'+decimals) + 'e-'+decimals);
    }
}
export default helpers;