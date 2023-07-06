import './DataEditTable.css'
import {
    Table,
    Tr,
    Th,
    Td,
    TableContainer,
    Tbody,
    Input,
    Modal,
    useDisclosure,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody, ModalFooter, Button,
} from '@chakra-ui/react'
import React from "react";

const DataEditTable = ({data, updateData}: { data: any[], updateData: (value: any) => void }) => {
    const {isOpen, onOpen, onClose} = useDisclosure();

    if (!data) return <></>

    const handleChange = (e: React.FormEvent<HTMLInputElement>, rowId: string, property: string) => {
        updateData(data.map((x) => {
            if (x.id !== rowId) return x;

            return ({
                ...x,
                [property]: e.currentTarget.value
            });
        }));
    }

    const handleDelete = (rowId: any) => {
        updateData(data.filter(x => x.id !== rowId));
    }

    const headers = new Set<string>();
    data.forEach(row => {
        Object.keys(row).forEach(key => {
            if (key === "id") return;//we don't want to be able to edit the id
            headers.add(key)
        });
    });
    const headerArray = Array.from(headers);

    const headerComponents = headerArray.map(header => <Th key={header}>{header}</Th>);
    const rows = data.map((row: any) => {
        const rowComponents = headerArray.map(header => {
            return (
                <Td key={row[header].id}>
                    <Input
                        size="sm"
                        bg="white"
                        onChange={(e) => handleChange(e, row.id, header)}
                        value={row[header]}
                    />
                </Td>
            )
        });
        rowComponents.push(<Td key="actions">
            <Button onClick={() => {
                handleDelete(row.id)
            }} colorScheme="red" size="xs">X</Button>
        </Td>)

        return (
            <Tr key={row.id}>
                {rowComponents}
            </Tr>
        )
    })

    return (
        <>
            <Button mt={21} onClick={onOpen}>Edit Data</Button>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size="6xl"
            >
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Edit Data</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
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
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    );
}

export default DataEditTable;
