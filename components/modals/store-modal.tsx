"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";

const StoreModal = () => {
  const storeModal = useStoreModal();

  return (
    <Modal
      title="Create Store"
      description="Add a new shop."
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>Store content</div>
    </Modal>
  );
};

export default StoreModal;
