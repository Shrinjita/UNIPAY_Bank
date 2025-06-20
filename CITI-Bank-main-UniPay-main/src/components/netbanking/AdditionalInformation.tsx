
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

interface AdditionalInformationProps {
  transferType: string;
  purpose: string;
  remarks: string;
  saveAsBeneficiary: boolean;
  onTransferTypeChange: (value: string) => void;
  onPurposeChange: (value: string) => void;
  onRemarksChange: (value: string) => void;
  onSaveAsBeneficiaryChange: (value: boolean) => void;
}

const AdditionalInformation: React.FC<AdditionalInformationProps> = ({
  transferType,
  purpose,
  remarks,
  saveAsBeneficiary,
  onTransferTypeChange,
  onPurposeChange,
  onRemarksChange,
  onSaveAsBeneficiaryChange
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-green-600">Additional Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="transferType" className="text-sm font-medium text-gray-700">Transfer Type</Label>
            <Select value={transferType} onValueChange={onTransferTypeChange}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select transfer method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="neft">NEFT (National Electronic Funds Transfer)</SelectItem>
                <SelectItem value="rtgs">RTGS (Real Time Gross Settlement)</SelectItem>
                <SelectItem value="imps">IMPS (Immediate Payment Service)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose" className="text-sm font-medium text-gray-700">Purpose of Transfer</Label>
            <Select value={purpose} onValueChange={onPurposeChange}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="family-maintenance">Family Maintenance</SelectItem>
                <SelectItem value="education">Education Expenses</SelectItem>
                <SelectItem value="medical">Medical Treatment</SelectItem>
                <SelectItem value="business">Business Transaction</SelectItem>
                <SelectItem value="investment">Investment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="remarks" className="text-sm font-medium text-gray-700">Remarks (Optional)</Label>
          <Textarea
            id="remarks"
            placeholder="Add any additional notes or comments"
            value={remarks}
            onChange={(e) => onRemarksChange(e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <Checkbox
            id="saveAsBeneficiary"
            checked={saveAsBeneficiary}
            onCheckedChange={(checked) => onSaveAsBeneficiaryChange(checked as boolean)}
          />
          <Label htmlFor="saveAsBeneficiary" className="text-sm text-gray-700 cursor-pointer">
            Save this beneficiary for future transfers
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdditionalInformation;