class URL{
    constructor(){
        this.isDevelopment = true;
    }

    GetURL(){
        if(this.isDevelopment)
        {
            return window.location.protocol + "//" + window.location.hostname+":3000/api/";
        }
        return window.location.protocol + "//" + window.location.hostname+"/api/";
    }
}

export default new URL();
