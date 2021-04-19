import React from 'react'

export default function CurrencyRow(props) {
    const {
        currencyOptions,
        selectedCurrency,
        onChangeCurrency,
        value,
        onValueChange,
        readOnly
    } = props
    return (
        <div className="text-center">
            {/* Changes the input tag to be readOnly if the boolean readOnly is set to true from props */}
            {readOnly ? (
                <div>
                    <input type="number" className="col-md-6 m-2" value={value} readOnly/>
                    <select className="ml-1 form-select" value={selectedCurrency} onChange={onChangeCurrency}>
                        {currencyOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            ) : (
                <div>
                    <input type="number" className="col-md-6 m-2" value={value} min="0" onChange={onValueChange} />
                    <select className="ml-1 form-select" value={selectedCurrency} onChange={onChangeCurrency}>
                        {currencyOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            )}
            
        </div>
    )
}
