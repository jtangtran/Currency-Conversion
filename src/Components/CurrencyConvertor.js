import React, {useState, useEffect} from 'react'
import CurrencyRow from './CurrencyRow';

export default function CurrencyConvertor() {
    // Country API 
    const countriesAPI = 'https://restcountries.eu/rest/v2/all';

    const [currencyOptions, setCurrencyOptions] = useState([]);
    const [fromCurrencyCode, setFromCurrencyCode] = useState();
    const [toCurrencyCode, setToCurrencyCode] = useState();
    const [errMsg, setErrMsg] = useState("");
    const [userInput, setUserInput] = useState(1);
    const [total, setTotal] = useState(1);
    const [conversionRate, setConversionRate] = useState(1);
    useEffect(() => {
        //fetches the country api and sets the default values for the fromCurrency and the toCurrency
        fetch(countriesAPI)
        .then(res => res.json())
        .then(data => {
            let updatedData = initializeCountryCurrencies(data);
            setCurrencyOptions(updatedData);
            let firstCurrencyCodeOption = updatedData["0"];
            setFromCurrencyCode(firstCurrencyCodeOption);
            setToCurrencyCode(firstCurrencyCodeOption);
        })
        .catch(err => {
            setErrMsg("Something went wrong, please try again.");
        })
    }, []);

    useEffect(() => {
        if (fromCurrencyCode !== undefined && toCurrencyCode !== undefined && userInput > 0) {
            fetch(`https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_API_KEY}/pair/${fromCurrencyCode}/${toCurrencyCode}/${userInput}`)
            .then(res => res.json())
            .then(data => {
                setConversionRate(data.conversion_rate)
                let rounded = data.conversion_result.toFixed(2);
                setTotal(rounded);
            })
            //error when either country code does not exist in the exchange rates api
            .catch(err => {
                setErrMsg('Unfortunately the currency code you have submitted is not in our system. Please try again with a different currency code.')
            });
        }
    }, [fromCurrencyCode, toCurrencyCode, userInput])

    //iterating through the array and retrieving only the first currency code from each country
    //only adding it to the currencyCodes array if it is not null or none
    const initializeCountryCurrencies = (data) => {
        let currencyCodes = [];
        data.forEach(country => {
            country.currencies.forEach(currency => {
                if (currency.code !== '(none)' && currency.code !== null) {
                    currencyCodes.push(currency.code);
                }
            })
        })
        //removing the duplicate currencies
        currencyCodes = currencyCodes.filter((element, idx) => currencyCodes.indexOf(element) === idx);
        return currencyCodes;
    }

    //updates the fromCurrencyCode
    const onChangeFromCurrencyCode = e => {
        setErrMsg('');
        setFromCurrencyCode(e.target.value);
    }

    //updates the toCurrencyCode
    const onChangeToCurrencyCode = e => {
        setErrMsg('');
        setToCurrencyCode(e.target.value);
    }

    const switchCurrencyCode = () => {
        setFromCurrencyCode(toCurrencyCode);
        setToCurrencyCode(fromCurrencyCode);
    }


    const onUserInputChange = e => {
        setErrMsg('');
        if (e.target.value < 0) {
            let posValue = Math.abs(e.target.value);
            setErrMsg('Number cannot be negative')
            setUserInput(posValue);
            return;
        } else {
            setUserInput(e.target.value);
        }
    }


    return (
        <div className="text-center">
            <h1 className="mt-4">Currency Convertor:</h1>
            <h4 className="mt-2 text-primary">Enter numbers to start converting!</h4>
            <h5 className="mt-3 text-danger">{errMsg}</h5>
            <p>The conversion rate for {fromCurrencyCode} to {toCurrencyCode} is {conversionRate}.</p>
            <CurrencyRow currencyOptions={currencyOptions} selectedCurrency={fromCurrencyCode} onChangeCurrency={onChangeFromCurrencyCode} value={userInput} onValueChange={onUserInputChange}/>
            <div className="text-center">
                <h5 className="">=</h5>
                <button className="btn-primary btn btn-lg m-2" onClick={switchCurrencyCode}>&#8595;&#8593;</button>
            </div>
            <CurrencyRow currencyOptions={currencyOptions} selectedCurrency={toCurrencyCode} onChangeCurrency={onChangeToCurrencyCode}
            value={total}/>

            <p className="text-center">{userInput} {fromCurrencyCode} is approximately equivalent to {total} {toCurrencyCode}</p>

        </div>
    )
}