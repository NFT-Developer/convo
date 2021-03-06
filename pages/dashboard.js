import { useState, useEffect, useContext, forwardRef } from 'react';
import Head from 'next/head';
import { useStyles, useTab, Box, useToast, useClipboard, Avatar, Tabs, TabList, TabPanels, Tab, TabPanel, Spinner, Flex, useColorModeValue, Heading, Button, IconButton, Tooltip } from "@chakra-ui/react";
import useSWR from 'swr';
import { Text, Table, Thead, Tbody, Tr, Th, Td, chakra } from "@chakra-ui/react"
import { CheckIcon, DeleteIcon, DownloadIcon, TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { useTable, useSortBy } from "react-table"

import { Web3Context } from '@/contexts/Web3Context'
import NavBar from '@/components/NavBar';
import PageShell from "@/components/PageShell";
import { getAvatar } from '@/utils/avatar';
import fetcher from '@/utils/fetcher';
import { truncateAddress, prettyTime } from "@/utils/stringUtils"
import { CodeIcon, Selectedcon } from '@/public/icons';
import DeveloperSection from '@/components/Dashboard/DeveloperSection';
import IdentitySection from '@/components/Dashboard/IdentitySection';
import AccountSection from '@/components/Dashboard/AccountSection';

const Dashboard = (props) => {

    const web3Context = useContext(Web3Context);
    const { connectWallet, signerAddress } = web3Context;
    const [formattedComments, setFormattedComments] = useState([]);
    const { hasCopied, onCopy } = useClipboard(signerAddress);
    const columns = [
        {
            Header: 'Webpage',
            accessor: 'url',
        },
        {
            Header: 'Comment',
            accessor: 'text',
        },
        {
            Header: 'Date',
            accessor: 'createdOn',
        }
    ];


    const { data: comments, error } = useSWR(
        signerAddress != "" ? [`/api/comments?author=${signerAddress}&apikey=CONVO`, "GET"] : null,
        fetcher
    );

    useEffect(() => {
        let newComments = [];
        if (Boolean(comments) === true) {
            for (let index = 0; index < comments.length; index++) {
                newComments.push({
                    id: comments[index]._id,
                    text: decodeURI(comments[index].text),
                    url: comments[index].url,
                    createdOn: prettyTime(comments[index].createdOn),
                })
            }
        }
        setFormattedComments(newComments);
    }, [comments]);


    const StyledTab = chakra("button", { themeKey: "Tabs.Tab" })

    const CustomTab = forwardRef((props, ref) => {

        const tabProps = useTab(props)
        const isSelected = !!tabProps["aria-selected"]
        const additionalStyles = isSelected ? {background : "radial-gradient(100% 464.29% at 0% 50%, rgba(60, 66, 82, 0.2) 0%, rgba(60, 66, 82, 0) 100%)"} : {}

        const styles = useStyles()

        return (
        <StyledTab __css={styles.tab} {...tabProps} width="100%" style={additionalStyles}>
            <Flex width="-webkit-fill-available" justifyContent="space-between" display="flex">
                <Flex>
                    {tabProps.children}
                </Flex>
                <Box as="span" ml={3}>
                    {isSelected ? (<Selectedcon />) : (<></>)}
                </Box>
            </Flex>
        </StyledTab>
        )
    })


    if (signerAddress === ""){
        return (<PageShell title="Dashboard | The Convo Space">
            <Flex
                direction="column"
                align={props?.align ? props.align : "center"}
                maxW="1600px"
                w={{ base: "95%", md: "80%", lg: "90%"}}
                m="0 auto"
            >
                <Heading as="h3" size="lg">
                    Let's start by connecting your wallet.
                </Heading>
                <br/>
                <Button borderRadius="30px" onClick={connectWallet}>
                    ????????????? Connect Wallet
                </Button>
            </Flex>
        </PageShell>)
    }
    else if (!comments){
        return (
            <PageShell title="Dashboard | The Convo Space">
                <Flex
                    direction="column"
                    align={props?.align ? props.align : "center"}
                    maxW="1600px"
                    w={{ base: "95%", md: "80%", lg: "90%"}}
                    m="0 auto"
                >
                    <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="white"
                        color="#100f13"
                        size="xl"
                    />
                </Flex>
            </PageShell>
        );
    }
    else if (comments && comments.length < 1 ){
        return (
            <PageShell title="Dashboard | The Convo Space">
                <Flex
                    direction="column"
                    align={props?.align ? props.align : "center"}
                    maxW="1600px"
                    w={{ base: "95%", md: "80%", lg: "90%"}}
                    m="0 auto"
                >
                    No Comments
                </Flex>
            </PageShell>
        );
    }
    else if (Boolean(comments) === true && comments.length >= 1) {

        return (
            <>
                <Head>
                    <title>Dashboard | The Convo Space</title>
                </Head>
                <Flex
                    direction="column"
                    align={props?.align ? props.align : "center"}
                    maxW="1600px"
                    w={{ base: "95%", md: "80%", lg: "90%"}}
                    m="0 auto"
                >
                    <NavBar/>
                </Flex>
                <Tabs isFitted variant="soft-rounded" colorScheme={useColorModeValue("blackAlpha","whiteAlpha")}>
                <Flex
                    direction="row"
                    alignItems="flex-start"
                    maxW="1600px"
                    w={{ base: "95%", md: "80%", lg: "80%"}}
                    m="0 auto"
                >
                    <Flex direction="column" height="80vh" width="24vh" mr={2}>
                        <Avatar mx={2} size="xl" name="Avatar" src={signerAddress != ""? getAvatar(signerAddress, {dataUri: true}) : getAvatar("0", {dataUri: true})} alt="signerAddress"/>
                        <Heading mx={2} mt={2} as="h3" size="lg" color={useColorModeValue("blackAlpha.800", "gray.400")}>
                            {truncateAddress(signerAddress, 3)}
                        </Heading>
                        <Button mx={2} size="xs" width="fit-content" onClick={onCopy} borderRadius={14}>
                            {hasCopied? (<CheckIcon />) : "Copy"}
                        </Button>
                        <br/>
                        <TabList>
                            <Flex
                                width="-webkit-fill-available"
                                direction="column"
                                alignItems="flex-start"
                                color={useColorModeValue("black", "white")}
                            >
                                <CustomTab>
                                    ??? Comments
                                </CustomTab>
                                <CustomTab>
                                    ???? Identity
                                </CustomTab>
                                <CustomTab>
                                    ???? My Data
                                </CustomTab>
                                <CustomTab>
                                    ??????????? Developer
                                </CustomTab>
                            </Flex>
                        </TabList>
                    </Flex>

                    <TabPanels>
                        <TabPanel height="80vh">
                            <Heading as="h3" size="lg">
                                ??? My Comments
                            </Heading>
                            <CommentsTable columns={columns} comments={formattedComments}/>
                        </TabPanel>
                        <TabPanel height="80vh">
                            <Heading as="h3" size="lg">
                                ???? My Identities
                            </Heading>
                            <IdentitySection mt={4}/>
                        </TabPanel>
                        <TabPanel height="80vh" w={{base:"60vw", md:"60vw"}}>
                            <Heading as="h3" size="lg" mb={4}>
                                ???? My Data
                            </Heading>
                            <AccountSection />
                        </TabPanel>
                        <TabPanel height="80vh">
                            <Heading as="h3" size="lg">
                                ??????????? Developer
                            </Heading>
                            <DeveloperSection />
                        </TabPanel>
                    </TabPanels>
                    </Flex>

                </Tabs>
            </>
        );
    }
    else {
        return (
            <PageShell title="Dashboard | The Convo Space">
                <Flex
                    direction="column"
                    align={props?.align ? props.align : "center"}
                    maxW="1600px"
                    w={{ base: "95%", md: "80%", lg: "90%"}}
                    m="0 auto"
                >
                    Whoops! Try Reloading the page.
                </Flex>
            </PageShell>
        );
    }

};

export default Dashboard;

const CommentsTable = ({ columns, comments}) => {

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data:comments }, useSortBy);

    const web3Context = useContext(Web3Context)
    const {signerAddress, getAuthToken} = web3Context;
    const toast = useToast()

    const [copyCode, setCopyCode] = useState("");
    const { hasCopied, onCopy } = useClipboard(copyCode);

    function copyEmbedCode(commentId){
        setCopyCode(`https://theconvo.space/embed/c/${commentId}`)
        onCopy();
    }

    async function handleDeleteComment(commentId){

        let token = await getAuthToken();

        let res = await fetcher(`${process.env.NEXT_PUBLIC_API_SITE_URL}/api/comments?apikey=CONVO`, "DELETE", {
            token,
            signerAddress,
            commentId,
        });
        console.log("deleted", commentId);

        if (Object.keys(res).includes('success') === true) {
            // mutate(comments.filter(item => item._id !== commentId), false);
            toast({
                title: "Gone!",
                description: `The comment is deleted.`,
                status: "success",
                duration: 5000,
                isClosable: true,
            })
        }
        else {
            toast({
                title: "Whoops!",
                description: res['error'],
                status: "error",
                duration: 10000,
                isClosable: true,
            })
        }

    }

    return (
    <Table {...getTableProps()} mt={4}>
        <Thead>
            {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    isNumeric={column.isNumeric}
                >
                    {column.render("Header")}
                    <chakra.span pl="4">
                    {column.isSorted ? (
                        column.isSortedDesc ? (
                        <TriangleDownIcon aria-label="sorted descending" />
                        ) : (
                        <TriangleUpIcon aria-label="sorted ascending" />
                        )
                    ) : null}
                    </chakra.span>
                </Th>
                ))}
                <Th>
                    Actions
                </Th>
            </Tr>
            ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
            {rows.map((row) => {
            prepareRow(row)
            return (
                <Tr {...row.getRowProps()}>
                    {
                        row.cells.map((cell) => {
                            return(
                                <Td {...cell.getCellProps()} isNumeric={cell.column.isNumeric}>
                                {cell.render("Cell")}
                                </Td>
                            )
                        })
                    }
                    <Td display="tabel-cell">
                        <Tooltip label="Delete Comment" aria-label="Delete Comment" hasArrow bg={useColorModeValue("red.500", "red.200")}>
                            <IconButton
                                variant="ghost"
                                colorScheme="red"
                                aria-label="Delete"
                                fontSize="20px"
                                icon={<DeleteIcon />}
                                onClick={()=>{handleDeleteComment(row.original.id)}}
                            />
                        </Tooltip>
                        <Tooltip label="Copy Embed Code" aria-label="Copy Embed Code">
                            <IconButton
                                variant="ghost"
                                aria-label="Copy Embed"
                                fontSize="20px"
                                icon={hasCopied ? (<CheckIcon />) : (<CodeIcon />)}
                                onClick={()=>{copyEmbedCode(row.original.id)}}
                            />
                        </Tooltip>
                    </Td>
                </Tr>
            )
            })}
        </Tbody>
    </Table>
    )

}
