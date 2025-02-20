import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import InputForm from './InputForm';

describe('InputForm Component', () => {
    test('renders form with input and submit button', () => {
        const { getByPlaceholderText, getByText } = render(<InputForm />);
        expect(getByPlaceholderText(/Enter Stock Symbol/i)).toBeInTheDocument();
        expect(getByText(/Submit/i)).toBeInTheDocument();
    });

    test('displays message when no stock symbol is entered', () => {
        const { getByText } = render(<InputForm />);
        expect(getByText(/Please enter a stock symbol above./i)).toBeInTheDocument();
    });

    test('fetches and displays stock data on form submission', async () => {
        const mockData = [
            { Date: '2021-01-01', Close: 100 },
            { Date: '2021-01-02', Close: 110 },
        ];

        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockData),
            })
        );

        const { getByPlaceholderText, getByText, getByRole } = render(<InputForm />);
        const input = getByPlaceholderText(/Enter Stock Symbol/i);
        const button = getByRole('button', { name: /Submit/i });

        fireEvent.change(input, { target: { value: 'AAPL' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(getByText(/2021-01-01/i)).toBeInTheDocument();
            expect(getByText(/100/i)).toBeInTheDocument();
            expect(getByText(/2021-01-02/i)).toBeInTheDocument();
            expect(getByText(/110/i)).toBeInTheDocument();
        });

        global.fetch.mockRestore();
    });
});
