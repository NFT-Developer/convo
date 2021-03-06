import React from "react"
import { Button, Box, useClipboard  } from "@chakra-ui/react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { coldarkDark } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { CheckIcon, CopyIcon } from '@chakra-ui/icons';

const CodeBlock = (props) => {
  const { language } = props;
  const { hasCopied, onCopy } = useClipboard(props?.code)

  return (
    <Box>
      <Button
        aria-label="CopyCode"
        variant="ghost"
        w={6}
        h={7}
        fontSize="small"
        letterSpacing="1px"
        fontWeight="500"
        color="black"
        align="right"
        backgroundColor="teal.200"
        _hover={{
          backgroundColor:"teal.400"
        }}
        _active={{
          backgroundColor:"teal.400"
        }}
        zIndex="1"
        position="fixed"
        position="absolute"
        mt="20px"
        right={{ base: "5vw", md:"12vw", lg:"21vw"}}
        onClick={onCopy}
      >
        {hasCopied ? (
          <CheckIcon/>
        ) : (
          <CopyIcon/>
        )}
      </Button>
      <SyntaxHighlighter
        language={language}
        style={coldarkDark}
        wrapLines={true}
        showLineNumbers={true}
        mt={5}
      >
        {props?.code}
      </SyntaxHighlighter>

    </Box>
  )
}

export default CodeBlock
