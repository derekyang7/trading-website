import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import PriceList from './PriceList';

describe('PriceList Component', () => {
    test('renders loading message initially', () => {
        const { getByText } = render(
            <MemoryRouter initialEntries={['/symbol/AAPL']}>
                <Route path="/symbol/:id" component={PriceList} />
            </MemoryRouter>
        );
        expect(getByText(/Please enter a stock symbol above./i)).toBeInTheDocument();
    });

    test('fetches and displays stock data', async () => {
        const mockData = [
            { Date: '2021-01-01', Close: 100 },
            { Date: '2021-01-02', Close: 110 },
        ];

        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockData),
            })
        );

        const { getByText } = render(
            <MemoryRouter initialEntries={['/symbol/AAPL']}>
                <Route path="/symbol/:id" component={PriceList} />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(getByText(/2021-01-01/i)).toBeInTheDocument();
            expect(getByText(/100/i)).toBeInTheDocument();
            expect(getByText(/2021-01-02/i)).toBeInTheDocument();
            expect(getByText(/110/i)).toBeInTheDocument();
        });

        global.fetch.mockRestore();
    });

    test('displays error message on fetch failure', async () => {
        global.fetch = jest.fn(() =>
            Promise.reject(new Error('Failed to fetch'))
        );

        const { getByText } = render(
            <MemoryRouter initialEntries={['/symbol/AAPL']}>
                <Route path="/symbol/:id" component={PriceList} />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(getByText(/Please enter a stock symbol above./i)).toBeInTheDocument();
        });

        global.fetch.mockRestore();
    });
});
