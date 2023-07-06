import './App.css'
import {XAxis, CartesianGrid, Tooltip, ComposedChart, Bar} from "recharts";
import client from "./data/client.ts";
import React, {useEffect, useState} from "react";
import DataEditTable from "./components/DataEditTable/DataEditTable.tsx";
import {Button, FormControl, FormLabel, Select} from "@chakra-ui/react";
import FileDrop from "./components/FileDrop/FileDrop.tsx";

type graphData = {
    name: string,
    [x: string | number | symbol]: unknown
}

function App() {
    const [uploadedData, setUploadedData] = useState<any | null>(null);
    const [graphData, setGraphData] = useState<graphData[]>([]);
    const [xSelectOptions, setXSelectOptions] = useState<string[]>([]);
    const [xSelectValue, setXSelectValue] = useState("");

    const handleUpload = async (file: any[]) => {
        const formData = new FormData();
        formData.append("files", file[0]);
        const res = await client.postCSV(formData);
        if (res.status === 200) {
            setUploadedData(res.data);
        }
    }
    const handleXSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setXSelectValue(event.target.value);
    }

    const handleClearData = () => {
        setUploadedData(null);
        setXSelectOptions([]);
        setXSelectValue("");
        setGraphData([]);
    }

    useEffect(() => {
        if (!uploadedData) return;
        const headers = new Set<string>();
        uploadedData.forEach((row: any) => {
            Object.keys(row).forEach(key => headers.add(key));
        });
        const headerArray = Array.from(headers);
        setXSelectOptions(headerArray);
    }, [uploadedData]);

    useEffect(() => {
        if (!uploadedData) return;
        const valueCount = new Map<string, number>();
        const newGraphData: graphData[] = [];
        uploadedData.forEach((x: any) => {
            const prev = valueCount.get(x[xSelectValue]);
            if (prev) {
                valueCount.set(
                    x[xSelectValue],
                    prev + 1
                )
            } else {
                valueCount.set(
                    x[xSelectValue],
                    1
                )
            }
        });
        for (const [key, value] of valueCount) {
            newGraphData.push({name: key, count: value})
        }
        setGraphData(newGraphData);
    }, [xSelectValue, uploadedData]);

    const xOptionComponents = xSelectOptions.map(x => <option key={x} value={x}>{x}</option>);

    return (
        <>
            <h1>CSV Visualizer</h1>
            <DataEditTable data={uploadedData} updateData={setUploadedData}/>
            <div className="card">
                {xSelectOptions.length > 0
                    ? <FormControl>
                        <FormLabel>Group Data By:</FormLabel>
                        <Select
                            value={xSelectValue}
                            onChange={handleXSelect}
                            placeholder="Select X Axis"
                        >
                            {xOptionComponents}
                        </Select>
                    </FormControl>
                    : <></>
                }
                {
                    graphData.length === 0 ?
                        <FileDrop handleUpload={handleUpload}/>
                        : <>
                            <ComposedChart width={900} height={400} data={graphData}>
                                <Bar fill="#A70000" dataKey="count"/>
                                <CartesianGrid stroke="#ccc"/>
                                <XAxis dataKey="name"/>
                                <Tooltip/>
                            </ComposedChart>
                            <Button colorScheme="red" onClick={handleClearData}>Clear Data</Button>
                        </>
                }
            </div>
        </>
    )
}

export default App
