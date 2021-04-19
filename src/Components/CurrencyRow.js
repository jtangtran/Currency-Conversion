import React from 'react'

export default function CurrencyRow(props) {
    const {
        currencyOptions,
        selectedCurrency,
        onChangeCurrency,
        value,
        onValueChange
    } = props
    return (
        <div className="text-center">
            <input type="number" className="col-md-6 m-2" value={value} onChange={onValueChange}/>
            <select className="ml-1 form-select" value={selectedCurrency} onChange={onChangeCurrency}>
                {currencyOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    )
}
