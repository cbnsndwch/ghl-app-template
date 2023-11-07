import { AxiosRequestConfig } from 'axios';

export type Spread<T1, T2> = Omit<T2, keyof T1> & T1;

export type RequestOptions<TData = any> = Partial<
    Spread<
        {
            method: never;
            url: never;
            headers: Record<
                string,
                string | string[] | number | boolean | null
            >;
        },
        AxiosRequestConfig<TData>
    >
> & {
    retryCount?: number;
};
