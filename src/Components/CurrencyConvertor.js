import React, {useState, useEffect} from 'react'
import CurrencyRow from './CurrencyRow';

export default function CurrencyConvertor() {
    // Country API 
    const countriesAPI = 'https://restcountries.eu/rest/v2/all';
    //States
    const [currencyOptions, setCurrencyOptions] = useState([]);
    const [fromCurrencyCode, setFromCurrencyCode] = useState();
    const [toCurrencyCode, setToCurrencyCode] = useState();
    const [errMsg, setErrMsg] = useState("");
    const [userInput, setUserInput] = useState(1);
    const [total, setTotal] = useState(1);
    const [conversionRate, setConversionRate] = useState(1);
    const [displayMsg, setDisplayMsg] = useState(true);
    //flag to send to the CurrencyRow
    let readOnly = true;

    useEffect(() => {
        //fetches the country api and sets the default values for the fromCurrencyCode and the toCurrencyCode
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
            setDisplayMsg(false);
        })
    }, []);

    useEffect(() => {
        //calculates the conversion amount if the fromCurrencyCode and toCurrencyCode is not undefined and if userInput is greater than 0
        if (fromCurrencyCode !== undefined && toCurrencyCode !== undefined && userInput > 0) {
            fetch(`https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_API_KEY}/pair/${fromCurrencyCode}/${toCurrencyCode}/${userInput}`)
            .then(res => res.json())
            .then(data => {
                setConversionRate(data.conversion_rate)
                //rounds the result of the conversion to 2 decimal places
                let rounded = data.conversion_result.toFixed(2);
                setTotal(rounded);
            })
            //error when either country code does not exist in the exchange rates api
            .catch(err => {
                setErrMsg('Unfortunately the currency code you have entered is not in our system. Please try again with a different currency code.')
                setDisplayMsg(false)
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
        setDisplayMsg(true);
        setFromCurrencyCode(e.target.value);
    }

    //updates the toCurrencyCode
    const onChangeToCurrencyCode = e => {
        setErrMsg('');
        setDisplayMsg(true);
        setToCurrencyCode(e.target.value);
    }

    //switches the fromCurrencyCode to the toCurrencyCode and the toCurrencyCode to the fromCurrencyCode based on the button click
    const switchCurrencyCode = () => {
        setFromCurrencyCode(toCurrencyCode);
        setToCurrencyCode(fromCurrencyCode);
    }

    //upates the user input and checks if the user input is negative
    const onUserInputChange = e => {
        setErrMsg('');
        setDisplayMsg(true);
        //handles if the user has entered a negative input and then autocorrects the input to be a 1
        if (e.target.value === '') {
            alert('Please enter a valid input of numbers only.');
            setUserInput(1);
            return;
        }
        else {
            setUserInput(e.target.value);
        }
    }

    return (
        <div className="text-center">
            <h1 className="mt-4">Currency Conversion:</h1>
            <h4 className="mt-2 text-success">Enter a number to begin the currency conversion!</h4>
            <h5 className="mt-3 text-danger">{errMsg}</h5>
            { displayMsg ? (
                <p>The conversion rate for {fromCurrencyCode} to {toCurrencyCode} is {conversionRate}.</p>
            ) : (<p></p>)}
            {/* fromCurrencyCode */}
            <CurrencyRow 
                currencyOptions={currencyOptions} 
                selectedCurrency={fromCurrencyCode} 
                onChangeCurrency={onChangeFromCurrencyCode} 
                value={userInput} 
                onValueChange={onUserInputChange}
                readOnly={!readOnly}
            />
            <div className="text-center">
                <h5 className="">=</h5>
                <button className="btn-success btn btn-lg m-2" onClick={switchCurrencyCode}>&#8595;&#8593;</button>
            </div>
            {/* toCurrencyCode */}
            <CurrencyRow 
                currencyOptions={currencyOptions} 
                selectedCurrency={toCurrencyCode} 
                onChangeCurrency={onChangeToCurrencyCode}
                value={total}
                readOnly={readOnly}    
            />
            { displayMsg ? (
                <p className="text-center">{userInput} {fromCurrencyCode} is approximately equivalent to {total} {toCurrencyCode} (rounded to 2 decimal places).</p>
            ) : (<p></p>)}

        </div>
    )
}
