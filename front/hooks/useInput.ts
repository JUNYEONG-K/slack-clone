import {Dispatch, SetStateAction, useCallback, useState} from "react";

type ReturnTypes<T = any> = [T, (e: { target: { value: any; }; }) => void, Dispatch<SetStateAction<T>>];

const useInput = <T = any>(input: T): ReturnTypes<T> => {
    const [value, setValue] = useState(input);
    const handler = useCallback((e: { target: { value: any; }; }) => {
        setValue(e.target.value);
    }, []);

    return [value, handler, setValue];
}

export default useInput;