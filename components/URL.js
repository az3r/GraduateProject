class URL{
    constructor(){
        this.isDevelopment = false;
    }

    GetURL(){
        if(this.isDevelopment)
        {
            return "http://localhost:3000/api/";
        }
        return "https://graduate-project-edvhz221m.vercel.app/api/"
    }
}

export default new URL();