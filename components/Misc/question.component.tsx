import {
  Badge,
  Box,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { Questions } from '../../types/registerForm.types';
import { camelize } from '../../utils/helpers/camelize';

interface Props {
  question: Questions;
  register: any;
}
export const QuestionComp = (props: Props) => {
  console.log(props.question.options, 'ques');

  if (props.question.type === 'CHECKBOX') {
    return (
      <>
        <FormControl>
          <Flex justify={'start'} gap={2}>
            <Checkbox
              isRequired={props.question.required}
              {...props.register(camelize(props.question.question))}
            />
            <Text>{props.question.question}</Text>

            {props.question.required && (
              <Text ml={-2} color='red'>
                *
              </Text>
            )}
          </Flex>
        </FormControl>
      </>
    );
  } else if (props.question.type === 'INPUT') {
    return (
      <FormControl key={'2'}>
        <Box display={'flex'} justifyContent={'start'}>
          <FormLabel>{props.question.question}</FormLabel>
          {props.question.required && (
            <Text ml={-2} color='red'>
              *
            </Text>
          )}
        </Box>
        <Flex gap='2' alignItems='center'>
          <Input
            placeholder={props.question.question}
            w='md'
            isRequired={props.question.required}
            {...props.register(camelize(props.question.question))}
          />
        </Flex>
      </FormControl>
    );
  } else if (props.question.type === 'LONGTEXT') {
    return (
      <FormControl key={'2'}>
        <Box display={'flex'} justifyContent={'start'}>
          <FormLabel>{props.question.question}</FormLabel>
          {props.question.required && (
            <Text ml={-2} color='red'>
              *
            </Text>
          )}
        </Box>
        <Flex gap='2' alignItems='center'>
          <Textarea
            placeholder={props.question.question}
            w='md'
            isRequired={props.question.required}
            {...props.register(camelize(props.question.question))}
          />
        </Flex>
      </FormControl>
    );
  } else if (props.question.type === 'DROPDOWN') {
    return (
      <>
        <Flex justify={'start'} w={'full'} flexDirection={'column'}>
          <Box display={'flex'} justifyContent={'start'} mx={3}>
            <FormLabel>{props.question.question}</FormLabel>
            {props.question.required && (
              <Text ml={-2} color='red'>
                *
              </Text>
            )}
          </Box>
          <Box w={'full'}>
            <Select
              w={'full'}
              {...props.register(camelize(props.question.question))}
            >
              {props.question.options?.map((option, index) => {
                return (
                  <option value={option} key={index}>
                    {option}
                  </option>
                );
              })}
            </Select>
          </Box>
        </Flex>
      </>
    );
  } else {
    return null;
  }
};
