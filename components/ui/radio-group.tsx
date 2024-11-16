import React, { useState } from 'react';

type RadioGroupProps = {
    options: string[];
    selectedValue: string;
    onChange: (value: string) => void;
};

const RadioGroup: React.FC<RadioGroupProps> = ({ options, selectedValue, onChange }) => {
    return (
        <div>
            {options.map((option) => (
                <div key={option} style={{ marginBottom: '10px' }}>
                    <input
                        type="radio"
                        id={option}
                        name="radioGroup"
                        value={option}
                        checked={selectedValue === option}
                        onChange={() => onChange(option)}
                    />
                    <label htmlFor={option} style={{ marginLeft: '8px' }}>
                        {option}
                    </label>
                </div>
            ))}
        </div>
    );
};

const App = () => {
    const [selectedOption, setSelectedOption] = useState('yes');

    const handleOptionChange = (value: string) => {
        setSelectedOption(value);
    };

    return (
        <div>
            <h2>请选择一个选项</h2>
            <RadioGroup
                options={['yes', 'no']}
                selectedValue={selectedOption}
                onChange={handleOptionChange}
            />
            <p>选中的值是：{selectedOption}</p>
        </div>
    );
};

export default App;
