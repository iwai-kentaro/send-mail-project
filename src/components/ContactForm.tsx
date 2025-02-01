import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useCallback, useState } from "react";

const ContactForm = () => {
  const API_URL = "/api/send-email"; // 環境変数から取得（デフォルトはVercelのAPI）
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(e.target.value);
    };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);

      try {
        const res = await axios.post(API_URL, {
          email,
          name,
          message,
        });

        if (res.status === 200) {
          toast({
            title: "メール送信成功！",
            description: "お問い合わせ内容が送信されました。",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setEmail("");
          setName("");
          setMessage("");
        } else {
          throw new Error("サーバーエラーが発生しました。");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        toast({
          title: "エラー",
          description: `メール送信に失敗しました: ${
            e.response?.data?.error || e.message
          }`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [API_URL, email, name, message, toast]
  );

  return (
    <Box
      w="100%"
      maxW="500px"
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      bg="white"
      m="auto"
      mt={10}
    >
      <Stack spacing={4}>
        <form onSubmit={handleSubmit}>
          <FormControl isRequired>
            <FormLabel>E-mail</FormLabel>
            <Input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={handleChange(setEmail)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>名前</FormLabel>
            <Input
              type="text"
              placeholder="お名前"
              value={name}
              onChange={handleChange(setName)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>メッセージ</FormLabel>
            <Textarea
              placeholder="お問い合わせ内容を入力してください"
              value={message}
              onChange={handleChange(setMessage)}
            />
          </FormControl>
          <Button
            colorScheme="blue"
            m={4}
            type="submit"
            isLoading={loading}
            width="100%"
          >
            送信
          </Button>
        </form>
      </Stack>
    </Box>
  );
};

export default ContactForm;
