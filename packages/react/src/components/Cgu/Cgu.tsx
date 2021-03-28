import type { Dictionary } from "@amfa-team/broadcast-service-types";
import { DotLoader } from "@amfa-team/theme-service";
import { useConnect } from "@amfa-team/user-service";
import { Button, Flex, Grid, Text } from "@chakra-ui/react";
import React from "react";

export interface CguProps {
  dictionary: Dictionary;
}

function Cgu(props: CguProps) {
  const { dictionary } = props;

  const { isConnecting, isReady, connect } = useConnect();

  return (
    <Flex
      h="full"
      w="full"
      position="relative"
      justifyContent="center"
      alignItems="center"
    >
      {isReady ? (
        <Grid
          column="1"
          templateRows="48px 100px"
          w="full"
          maxW="container.md"
          m="auto"
        >
          <Button
            colorScheme="secondary"
            w="full"
            size="lg"
            onClick={connect}
            disabled={isConnecting}
            isLoading={isConnecting}
          >
            {dictionary.join}
          </Button>
          <Flex justifyContent="center" alignItems="center">
            <Text textAlign="center">{dictionary.cgu}</Text>
          </Flex>
        </Grid>
      ) : (
        <DotLoader />
      )}
    </Flex>
  );
}

export default React.memo<CguProps>(Cgu);
