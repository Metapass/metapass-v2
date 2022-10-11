import {
  Box,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Select,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { camelize } from '../../utils/helpers/camelize';
type quesType = 'DROPDOWN' | 'CHECKBOX';
type Question = {
  type: quesType;
  question: string;
  options?: string[];
  requird: boolean;
  id: number;
};
interface Props {
  question: Question;
  register: any;
}
export const QuestionComp = (props: Props) => {
  // console.log(props)

  if (props.question.type === 'CHECKBOX') {
    return (
      <>
        <FormControl>
          <Flex justify={'start'} gap={2}>
            <Checkbox
              isRequired={props.question.requird}
              {...props.register(camelize(props.question.question))}
            />
            <Text>{props.question.question}</Text>

            {props.question.requird && (
              <Text ml={-2} color='red'>
                *
              </Text>
            )}
          </Flex>
        </FormControl>
      </>
    );
  } else {
    return (
      <>
        <Flex justify={'start'} flexDirection={'column'}>
          <Box display={'flex'} justifyContent={'start'} mx={3}>
            <FormLabel>{props.question.question}</FormLabel>
            {props.question.requird && (
              <Text ml={-2} color='red'>
                *
              </Text>
            )}
          </Box>
          <Flex justify={'start'}>
            <Select {...props.register(camelize(props.question.question))}>
              {props.question.options?.map((option, index) => (
                <option value={option} key={index}>
                  {option}
                </option>
              ))}
            </Select>
          </Flex>
        </Flex>
      </>
    );
  }
};
