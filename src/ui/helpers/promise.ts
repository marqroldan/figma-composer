
export const promiseObject = <T>(): {
    requestPromise: Promise<T>,
    resolvePromise: (result: T) => void;
    rejectPromise: (...args: any[]) => any
} => {
    let resolvePromise = (() => null) as (result: T) => void;
    let rejectPromise = (): any => null;
    const requestPromise = new Promise<T>((resolve, reject) => {
        resolvePromise = resolve;
        rejectPromise = reject;
    });

    return {
        requestPromise,
        resolvePromise,
        rejectPromise,
    };
};

export default promiseObject;