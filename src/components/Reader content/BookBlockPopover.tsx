import { FormControl, InputGroup, Popover } from "react-bootstrap";

type BlockBookPopoverProps = {
  blockReason: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const BlockBookPopover: React.FC<BlockBookPopoverProps> = ({ blockReason, onChange }) => {
  return (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Enter block reason</Popover.Header>
      <Popover.Body>
        <InputGroup>
          <FormControl
            placeholder="Block reason"
            value={blockReason}
            onChange={onChange}
            onClick={(e) => e.stopPropagation()}
          />
        </InputGroup>
      </Popover.Body>
    </Popover>
  );
};

export default BlockBookPopover;