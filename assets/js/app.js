

const exchangeCurrencyURL = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';
const ovdpURL =  'https://bank.gov.ua/NBUStatService/v1/statdirectory/ovdp?json';

import {createApp} from "../../node_modules/vue/dist/vue.esm-browser.js";

const app = createApp ({
    data()  {
        return {
            
            dataToday: '',
            dateStart1: '',
            dateEnd1: '',
            dateStart2: '',
            dateEnd2: '',
            ovdpList: [],
            currency: [],
            rateUSD: '',
            rateEUR: '',
        }
    },

    computed: {

        difference1() {

            let diffAttracted = 0;
            if (this.sumAttracted1 && this.sumAttracted2) {
                diffAttracted = ((this.sumAttracted2 / this.sumAttracted1) * 100) - 100;
            }            
            return diffAttracted.toFixed(0);          
        },

        difference2() {

            let diffReturn = 0;
            if (this.sumReturn2 && this.sumReturn1) {            
                diffReturn = ((this.sumReturn2 / this.sumReturn1) * 100) - 100;
            }
            return diffReturn.toFixed(0);
        },       

        sumAttracted1() {

            return this.getAttraction(this.dateStart1, this.dateEnd1);
        },

        sumReturn1() {

            return this.returnAttraction(this.dateStart1, this.dateEnd1);
        },

        sumAttracted2() {

            return this.getAttraction(this.dateStart2, this.dateEnd2);
        },

        sumReturn2() {

            return this.returnAttraction(this.dateStart2, this.dateEnd2);
        },  
    },

    methods: {
        
        getAttraction(data1, data2) {

            return  this.ovdpList.filter(item => (item.paydate >= data1) && (item.paydate <= data2)).reduce((acc, item) => acc + Math.round(item.attraction), 0);               
        },

        returnAttraction(data1, data2) {
            
            return  this.ovdpList.filter(item => (item.repaydate >= data1) && (item.repaydate <= data2)).reduce((acc, item) => acc + Math.round(item.attraction), 0);            
        },
    },

    async mounted() {

        let exchangeCurrency = await fetch(exchangeCurrencyURL);
            exchangeCurrency = await exchangeCurrency.json();
            console.log(exchangeCurrency);
                          
            let currencyUSD = '';
            let currencyEUR = '';

            exchangeCurrency.forEach(item => {
                                   
                if (item.cc == 'USD') {
                    currencyUSD = item.rate;
                } else if (item.cc == 'EUR') {
                    currencyEUR = item.rate;
                }                    
            });

            this.rateUSD = currencyUSD.toFixed(2);
            this.rateEUR = currencyEUR.toFixed(2);       
            this.currency = exchangeCurrency;

        let ovdp = await fetch(ovdpURL);
            ovdp = await ovdp.json();
                      
            ovdp.forEach(item => (item.paydate = item.paydate.split('.').reverse().join('-')) && (item.repaydate = item.repaydate.split('.').reverse().join('-')));

            for (let item of ovdp) {               

                        if (item.valcode == 'USD') {
                        
                            item.attraction  = item.attraction * currencyUSD;
                                     
                        } else if ( item.valcode == 'EUR') {

                            item.attraction  = item.attraction * currencyEUR;
                    
                        } else {
                            item.attraction = item.attraction;
                   
                        };      
                };       
                        
            console.log(ovdp);
            this.ovdpList = ovdp;
                           
            this.dataToday = new Date().toLocaleString();
    },
});

app.mount('#app');



      





