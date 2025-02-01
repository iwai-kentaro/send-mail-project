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

function App() {
  const API_URL = import.meta.env.VITE_API_URL; // 環境変数から取得

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const toast = useToast();

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const res = await axios.post(
          `${API_URL}/send-email`,
          {
            email,
            name,
            message,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true, // これを追加
          }
        );
        toast({
          title: "メール送信成功！",
          description: "メールが送信されました。",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        alert("メールを送信しました");
        console.log(res);
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
        alert(`エラーが発生しました: ${e.response?.data?.error || e.message}`);
      } finally {
        setEmail("");
        setName("");
        setMessage("");
      }
    },
    [API_URL, email, message, name, toast]
  );

  return (
    <Box
      w={400}
      p={4}
      borderWidth={1}
      borderRadius={8}
      flex={1}
      boxShadow="lg"
      bg="white"
      m={"auto"}
      mt={10}
    >
      <Stack spacing={4}>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>E-mail</FormLabel>
            <Input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={handleChangeEmail}
            />
          </FormControl>
          <FormControl>
            <FormLabel>名前</FormLabel>
            <Input
              type="name"
              placeholder="お名前"
              value={name}
              onChange={handleChangeName}
            />
          </FormControl>
          <FormControl>
            <FormLabel>メッセージ</FormLabel>
            <Textarea
              placeholder="お問い合わせ内容を入力してください"
              value={message}
              onChange={handleChangeMessage}
            />
          </FormControl>
          <Button colorScheme="blue" m={4} type="submit">
            送信
          </Button>
        </form>
      </Stack>
    </Box>
  );
}

export default App;
