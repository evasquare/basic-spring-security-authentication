import { useEffect, useState } from "react";

function App() {
    const [value, setValue] = useState<string>("");
    useEffect(() => {
        (async () => {
            const response = await fetch("https://google.com");
            const text = await response.text();

            setValue(text);
        })();
    }, []);

    return <>{value}</>;
}

export default App;
