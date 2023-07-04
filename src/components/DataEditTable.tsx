import {
    Table,
    Tr,
    Th,
    Td,
    TableContainer, Tbody, Input,
} from '@chakra-ui/react'
import React from "react";

const DataEditTable = ({data, updateData}: { data: any[], updateData: (value: any) => void }) => {
    if (!data) return <></>

    const handleChange = (e:React.FormEvent<HTMLInputElement>,index:number,property: string) => {
        updateData(data.map((x,i) => {
            if (i === index){
                return({
                    ...x,
                    [property]: e.currentTarget.value
                });
            }

            return x;
        }));
    }

    const headers = new Set<string>();
    data.forEach(row => {
        Object.keys(row).forEach(key => headers.add(key));
    });
    const headerArray = Array.from(headers);

    const headerComponents = headerArray.map(header => <Th key={header}>{header}</Th>);
    const rows = data.map((row: any,i) => {
        const filteredHeaders = headerArray.filter(header => row[header]);
        const rowComponents = filteredHeaders.map(header => {
            return (
                <Td key={header + i}>
                    <Input
                        onChange={(e) => handleChange(e, i, header)}
                        value={row[header]}
                    />
                </Td>
            )
        });

        return (
            <Tr key={i}>
                {rowComponents}
            </Tr>
        )
    })

    return (
        <TableContainer>
            <Table variant="striped">
                <Tbody>
                    <Tr>
                        {headerComponents}
                    </Tr>
                    {rows}
                </Tbody>
            </Table>
        </TableContainer>
    );
}

export default DataEditTable;
