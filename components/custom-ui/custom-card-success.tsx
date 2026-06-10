import { CheckCircle } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

import CustomButton from './custom-button';

type Props = {
  title: string;
  message: string;
  buttonTitle: string;
  onClick?: () => void;
};

const CustomCardSuccess: React.FC<Props> = ({
  title,
  message,
  buttonTitle,
  onClick,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center gap-2">
          <CheckCircle
            size={30}
            className="flex flex-row justify-center text-primary"
          />
          <h2 className="text-xl font-bold text-text-primary">{title}</h2>
          <p className="text-base text-text-secondary">{message}</p>
          <div className="w-full pt-4">
            <CustomButton
              type="submit"
              title={buttonTitle}
              onClick={onClick}
              buttonProps={{ className: 'w-full' }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomCardSuccess;
