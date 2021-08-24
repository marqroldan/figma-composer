
export const promiseObject = <T>(): {
    requestPromise: Promise<T>,
    promiseResolve: (result: T) => void;
    promiseReject: (...args: any[]) => any
} => {
    let promiseResolve = (() => null) as (result: T) => void;
    let promiseReject = (): any => null;
    const requestPromise = new Promise<T>((resolve, reject) => {
        promiseResolve = resolve;
        promiseReject = reject;
    });

    return {
        requestPromise,
        promiseResolve,
        promiseReject,
    };
};
