
import React, { useState, useEffect, useCallback } from 'react';
import { Product, Category, User, CartItem, HeldTicket, ModalType, CompletedTransaction, AppView, VatBreakdownMap, EstablishmentDetails, Currency, UserRole } from './types';
import { PRODUCTS as INITIAL_PRODUCTS, CATEGORIES as INITIAL_CATEGORIES, USERS as INITIAL_USERS, INITIAL_ESTABLISHMENT_DETAILS, PAYMENT_METHODS, CURRENCIES } from './constants';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import ProductList from './components/ProductList';
import SelectedProductDisplay from './components/SelectedProductDisplay';
import CartDisplay from './components/CartDisplay';
import NumericKeypad from './components/NumericKeypad';
import SellerSelector from './components/SellerSelector';
import QuickActions, { QuickActionsState } from './components/QuickActions';
import BottomNavBar from './components/BottomNavBar';
import Modal from './components/Modal';
import PrintReceiptModal from './components/PrintReceiptModal';
import PaymentModal from './components/PaymentModal';
import ManagementScreen from './components/management/ManagementScreen'; 
import FinancialScreen from './components/financial/FinancialScreen';  
import AddProductModal from './components/management/AddProductModal';
import AddCategoryModal from './components/management/AddCategoryModal';
import AddUserModal from './components/management/AddUserModal';
import HeldTicketsDisplay from './components/HeldTicketsDisplay';
import Icon from './components/Icon';

// The application now runs with a static, hardcoded user. No authentication is performed.
const SESSION_USER: User = INITIAL_USERS.find(u => u.role === UserRole.Admin) || INITIAL_USERS[0];

const App: React.FC = () => {
  // Authentication State is removed, we use a static user.
  const [loggedInUser, setLoggedInUser] = useState<User | null>(SESSION_USER);

  // App View State
  const [currentView, setCurrentView] = useState<AppView>(AppView.POS);

  // Management Data State - Initialized from constants, managed locally.
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS); 
  const [establishmentDetails, setEstablishmentDetails] = useState<EstablishmentDetails>(INITIAL_ESTABLISHMENT_DETAILS);

  // Operational Data State - All local to the session.
  const [invoiceCounter, setInvoiceCounter] = useState<number>(1);
  const [heldTickets, setHeldTickets] = useState<HeldTicket[]>([]);
  const [completedTransactions, setCompletedTransactions] = useState<CompletedTransaction[]>([]);

  // POS-specific ephemeral states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [numericInputValue, setNumericInputValue] = useState<string>('');
  const [isQuantityMode, setIsQuantityMode] = useState<boolean>(false);
  const [currentSellerId, setCurrentSellerId] = useState<string | null>(null); 
  const [activeModal, setActiveModal] = useState<ModalType>(ModalType.NONE);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [tempDiscountInput, setTempDiscountInput] = useState<string>('');
  const [currentTransactionInvoiceId, setCurrentTransactionInvoiceId] = useState<string>('');
  const [posRightPanelView, setPosRightPanelView] = useState<'cart' | 'held_tickets'>('cart');
  const [justPaid, setJustPaid] = useState<boolean>(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  
  // Management specific modal states
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState<boolean>(false);

  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState<boolean>(false);
  
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState<boolean>(false);
  const [isCloseDayModalOpen, setIsCloseDayModalOpen] = useState<boolean>(false);

  // Set default seller on load
  useEffect(() => {
    if (users.length > 0 && !currentSellerId && loggedInUser) {
        setCurrentSellerId(loggedInUser.id);
    }
  }, [users, currentSellerId, loggedInUser]);
  
  // Persist establishment details to local state
  const handlePersistEstablishmentDetails = useCallback((details: EstablishmentDetails) => {
      setEstablishmentDetails(details);
      alert("Paramètres de l'établissement mis à jour (localement).");
  }, []);

  const prepareNewInvoiceId = useCallback(() => {
    setCurrentTransactionInvoiceId(`INV-${String(invoiceCounter).padStart(4, '0')}`);
  }, [invoiceCounter]);

  useEffect(() => {
    prepareNewInvoiceId();
  }, [prepareNewInvoiceId]);

  const resetCartAndSelectionLogic = useCallback(() => {
    setCartItems([]);
    setSelectedProduct(null);
    setNumericInputValue('');
    setIsQuantityMode(false);
    setDiscountPercentage(0);
  }, []);
  
  const completeAndFinalizeTransaction = useCallback(() => {
    resetCartAndSelectionLogic();
    setInvoiceCounter(prev => prev + 1);
    setActiveModal(ModalType.NONE); 
  }, [resetCartAndSelectionLogic]);

  const startNewInvoiceAction = useCallback(() => {
    resetCartAndSelectionLogic();
    prepareNewInvoiceId(); 
    setActiveModal(ModalType.NONE); 
  }, [resetCartAndSelectionLogic, prepareNewInvoiceId]);

  const cancelCurrentWorkAction = useCallback(() => {
    resetCartAndSelectionLogic(); 
    setActiveModal(ModalType.NONE);
  }, [resetCartAndSelectionLogic]);

  useEffect(() => {
    let currentFiltered = products;
    if (selectedCategoryId) {
      currentFiltered = currentFiltered.filter(p => p.category === selectedCategoryId);
    }
    if (searchTerm) {
      currentFiltered = currentFiltered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProducts(currentFiltered);
  }, [searchTerm, selectedCategoryId, products]);

  const addProductToCart = useCallback((productToAdd: Product, quantity: number) => {
    if (quantity <= 0) return;
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === productToAdd.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === productToAdd.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product: productToAdd, quantity }];
    });
  }, []);

  const handleProductSelect = useCallback((productToSelect: Product) => {
    setSelectedProduct(productToSelect);
    const quantity = parseInt(numericInputValue, 10);
    const quantityToAdd = !isNaN(quantity) && quantity > 0 ? quantity : 1;
    addProductToCart(productToSelect, quantityToAdd);
    setNumericInputValue('');
    setIsQuantityMode(false);
  }, [addProductToCart, numericInputValue]);


  const updateCartItemQuantity = useCallback((productId: string, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId ? { ...item, quantity: Math.max(0, newQuantity) } : item
      ).filter(item => item.quantity > 0)
    );
  }, []);

  const removeCartItem = useCallback((productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  }, []);

  const handleNumericKeyPress = useCallback((key: string) => {
    if (key === 'Qty') {
        setIsQuantityMode(true);
        setNumericInputValue(''); 
        return;
    }
    if (activeModal === ModalType.DISCOUNT) {
        setTempDiscountInput(prev => {
            if (prev.length >= 5 && key !== '.') return prev;
            if (key === '.' && prev.includes('.')) return prev;
            return prev + key;
        });
    } else {
        setNumericInputValue(prev => prev + key);
    }
  }, [activeModal]);

  const handleNumericClear = useCallback(() => {
    if (activeModal === ModalType.DISCOUNT) {
        setTempDiscountInput('');
    } else {
        setNumericInputValue('');
    }
  }, [activeModal]);
  
  const handleNumericBackspace = useCallback(() => {
    if (activeModal === ModalType.DISCOUNT) {
        setTempDiscountInput(prev => prev.slice(0, -1));
    } else {
        setNumericInputValue(prev => prev.slice(0, -1));
    }
  }, [activeModal]);

  const handleNumericEnter = useCallback(() => {
    if (activeModal === ModalType.DISCOUNT) {
        const discountVal = parseFloat(tempDiscountInput);
        if (!isNaN(discountVal) && discountVal >= 0 && discountVal <= 100) {
            setDiscountPercentage(discountVal);
            setActiveModal(ModalType.NONE);
        } else {
            alert("Veuillez entrer un pourcentage de réduction valide (0-100).");
        }
        setTempDiscountInput('');
        return;
    }
    if (isQuantityMode && numericInputValue) {
      const quantity = parseInt(numericInputValue, 10);
      if (!isNaN(quantity) && quantity > 0) {
        if(selectedProduct){
          const itemInCart = cartItems.find(item => item.product.id === selectedProduct.id);
          if (itemInCart) {
            updateCartItemQuantity(selectedProduct.id, quantity);
          } else {
            addProductToCart(selectedProduct, quantity);
          }
        }
      }
    }
    setNumericInputValue('');
    setIsQuantityMode(false);
  }, [numericInputValue, selectedProduct, addProductToCart, activeModal, tempDiscountInput, cartItems, updateCartItemQuantity, isQuantityMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (currentView !== AppView.POS || activeModal !== ModalType.NONE) return;
        const target = e.target as HTMLElement;
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        if ((e.key >= '0' && e.key <= '9') || e.key === '.') { e.preventDefault(); handleNumericKeyPress(e.key); } 
        else if (e.key === '*') { e.preventDefault(); handleNumericKeyPress('Qty'); } 
        else if (e.key === 'Enter') { e.preventDefault(); handleNumericEnter(); } 
        else if (e.key === 'Backspace') { e.preventDefault(); handleNumericBackspace(); } 
        else if (e.key === 'Delete' || e.key === 'Clear') { e.preventDefault(); handleNumericClear(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentView, activeModal, handleNumericKeyPress, handleNumericEnter, handleNumericClear, handleNumericBackspace]);

  const handleQuickAction = useCallback((actionId: string) => {
    const newHeldTicketData: HeldTicket = {
        id: `held_${Date.now()}`,
        timestamp: new Date(),
        items: JSON.parse(JSON.stringify(cartItems)), // Deep copy
        sellerName: users.find(s => s.id === currentSellerId)?.name || 'N/A',
        discountPercentage: discountPercentage,
        invoiceId: currentTransactionInvoiceId 
    };

    switch (actionId) {
      case 'new_invoice':
        if (cartItems.length > 0) {
            setHeldTickets(prev => [...prev, newHeldTicketData]);
            startNewInvoiceAction();
        } else {
            startNewInvoiceAction();
        }
        break;
      case 'print_receipt':
        if (cartItems.length > 0) setActiveModal(ModalType.PRINT_RECEIPT);
        else alert("Le panier est vide. Rien à imprimer.");
        break;
      case 'hold':
        if (cartItems.length > 0) {
            setHeldTickets(prev => [...prev, newHeldTicketData]);
            resetCartAndSelectionLogic(); 
            alert('Ticket mis en attente.');
        } else alert("Le panier est vide.");
        break;
      case 'retrieve': setPosRightPanelView('held_tickets'); break;
      case 'discount':
         if (cartItems.length > 0) {
            setTempDiscountInput(discountPercentage > 0 ? discountPercentage.toString() : '');
            setActiveModal(ModalType.DISCOUNT);
        } else alert("Le panier est vide. Impossible d'appliquer une réduction.");
        break;
      case 'pay':
         if (cartItems.length > 0) setActiveModal(ModalType.PAYMENT);
         else alert("Le panier est vide.");
        break;
      case 'cancel':
        if (cartItems.length > 0 || numericInputValue) setActiveModal(ModalType.CONFIRM_CANCEL_CURRENT_WORK);
        else cancelCurrentWorkAction(); 
        break;
      default: console.warn('Unknown quick action:', actionId);
    }
  }, [cartItems, startNewInvoiceAction, cancelCurrentWorkAction, currentSellerId, numericInputValue, discountPercentage, resetCartAndSelectionLogic, currentTransactionInvoiceId, users]);
  
  const calculateTotals = useCallback(() => {
    const subTotalTTC = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const discountAmount = subTotalTTC * (discountPercentage / 100);
    const totalTTCAfterDiscount = subTotalTTC - discountAmount;

    const itemsWithFinalPricing = cartItems.map(item => {
        const originalItemTotalTTC = item.product.price * item.quantity;
        const itemDiscountProportion = discountPercentage / 100;
        const discountedItemTotalTTC = originalItemTotalTTC * (1 - itemDiscountProportion);
        const finalPriceHT = discountedItemTotalTTC / (1 + item.product.vatRate);
        const finalVAT = discountedItemTotalTTC - finalPriceHT;
        return { ...item, finalTotalTTC: discountedItemTotalTTC, finalTotalHT: finalPriceHT, finalTotalVAT: finalVAT };
    });

    const totalHTAfterDiscount = itemsWithFinalPricing.reduce((sum, item) => sum + item.finalTotalHT, 0);
    const totalVATAfterDiscount = itemsWithFinalPricing.reduce((sum, item) => sum + item.finalTotalVAT, 0);
    
    const vatBreakdown: VatBreakdownMap = {};
    itemsWithFinalPricing.forEach(item => {
        const rateKey = (item.product.vatRate * 100).toFixed(1); 
        if (!vatBreakdown[rateKey]) vatBreakdown[rateKey] = { ht: 0, tva: 0 };
        vatBreakdown[rateKey].ht += item.finalTotalHT;
        vatBreakdown[rateKey].tva += item.finalTotalVAT;
    });

    return { subTotalTTC, discountAmount, totalTTC: totalTTCAfterDiscount, totalHT: totalHTAfterDiscount, totalVAT: totalVATAfterDiscount, vatBreakdown };
  }, [cartItems, discountPercentage]);

  const handleRetrieveTicket = (ticketId: string) => {
    const ticketToRetrieve = heldTickets.find(t => t.id === ticketId);
    if (ticketToRetrieve) {
      if (cartItems.length > 0) {
        alert("Veuillez finaliser ou mettre en attente le ticket actuel avant d'en récupérer un autre.");
        return;
      }
      resetCartAndSelectionLogic(); 
      setCartItems(ticketToRetrieve.items);
      setDiscountPercentage(ticketToRetrieve.discountPercentage);
      setCurrentTransactionInvoiceId(ticketToRetrieve.invoiceId || `INV-${String(invoiceCounter).padStart(4, '0')}`);
      const userFound = users.find(s => s.name === ticketToRetrieve.sellerName);
      if (userFound) setCurrentSellerId(userFound.id);
      
      setHeldTickets(prevTickets => prevTickets.filter(t => t.id !== ticketId));
      setPosRightPanelView('cart');
    }
  };

  const handleAddProduct = useCallback((newProductData: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...newProductData, id: `prod_${Date.now()}` };
    setProducts(prevProducts => [...prevProducts, newProduct]);
    setIsAddProductModalOpen(false); 
  }, []);
  
  const handleUpdateProduct = useCallback((updatedProductData: Product) => {
    setProducts(prevProducts => prevProducts.map(p => p.id === updatedProductData.id ? updatedProductData : p));
    setIsEditProductModalOpen(false); setEditingProduct(null);
  }, []);

  const handleOpenEditProductModal = useCallback((product: Product) => {
    setEditingProduct(product); setIsEditProductModalOpen(true);
  }, []);

  const handleAddCategory = useCallback((newCategoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = { ...newCategoryData, id: `cat_${Date.now()}` };
    setCategories(prev => [...prev, newCategory]);
    setIsAddCategoryModalOpen(false);
  }, []);

  const handleUpdateCategory = useCallback((updatedCategoryData: Category) => {
    setCategories(prev => prev.map(c => c.id === updatedCategoryData.id ? updatedCategoryData : c));
    setIsEditCategoryModalOpen(false); setEditingCategory(null);
  }, []);

  const handleOpenEditCategoryModal = useCallback((category: Category) => {
    setEditingCategory(category); setIsEditCategoryModalOpen(true);
  }, []);

  const handleAddUser = useCallback((newUserData: Omit<User, 'id'>) => {
      const newUser: User = { ...newUserData, id: `user_${Date.now()}` };
      setUsers(prev => [...prev, newUser]);
      setIsAddUserModalOpen(false);
  }, []);

  const handleDayClose = useCallback(() => {
    alert('Le rapport financier peut être consulté et imprimé depuis l\'onglet "Financier" pour la période de votre choix.');
    setIsCloseDayModalOpen(false);
  }, []);

  const handleDeleteTransaction = useCallback((docId: string) => {
    const txToDelete = completedTransactions.find(tx => tx.id === docId);
    setCompletedTransactions(prev => prev.filter(tx => tx.id !== docId));
    setTransactionToDelete(null);
    setActiveModal(ModalType.NONE);
    alert(`La facture N° ${txToDelete?.invoiceId || docId} a été supprimée.`);
  }, [completedTransactions]);


  const quickActionsState: QuickActionsState = { cartItemCount: cartItems.length, numericInputValue: numericInputValue };
  const currencySymbol = establishmentDetails.currency.symbol;
  const isCloseDayDisabled = cartItems.length > 0 || heldTickets.length > 0;
  const transactionForDeletion = completedTransactions.find(t => t.id === transactionToDelete);


  if (!loggedInUser) {
    // This case should not be reached anymore, but as a fallback:
    return <div className="flex items-center justify-center h-screen text-lg">Erreur: Utilisateur non défini.</div>;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case AppView.MANAGEMENT:
        if (loggedInUser.role !== UserRole.Admin) {
            setCurrentView(AppView.POS); // Redirect non-admins
            return null;
        }
        return <ManagementScreen 
                    products={products} categories={categories} users={users}
                    establishmentDetails={establishmentDetails}
                    currencies={CURRENCIES}
                    onEstablishmentDetailsChange={handlePersistEstablishmentDetails}
                    onOpenAddProductModal={() => setIsAddProductModalOpen(true)}
                    onOpenEditProductModal={handleOpenEditProductModal}
                    onOpenAddCategoryModal={() => setIsAddCategoryModalOpen(true)}
                    onOpenEditCategoryModal={handleOpenEditCategoryModal}
                    onOpenAddUserModal={() => setIsAddUserModalOpen(true)}
                />;
      case AppView.FINANCIAL:
        return <FinancialScreen 
                    completedTransactions={completedTransactions} 
                    establishmentDetails={establishmentDetails} 
                    userRole={loggedInUser.role}
                    onDeleteTransaction={(docId) => { 
                       setTransactionToDelete(docId);
                       setActiveModal(ModalType.CONFIRM_DELETE_TRANSACTION);
                    }}
                />;
      case AppView.POS:
      default:
        return (
          <div className="flex flex-1 overflow-hidden pt-2 pb-[70px]">
            <div className="w-3/5 lg:w-3/5 xl:w-7/12 p-3 flex flex-col overflow-hidden">
              <SearchBar searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
              <CategoryFilter categories={categories} selectedCategoryId={selectedCategoryId} onSelectCategory={setSelectedCategoryId} />
              <div className="flex-grow overflow-y-auto mt-2 pr-1">
                <ProductList products={filteredProducts} categories={categories} onProductSelect={handleProductSelect} currencySymbol={currencySymbol} />
              </div>
            </div>

            <div className="w-2/5 lg:w-2/5 xl:w-5/12 p-3 bg-white shadow-lg flex flex-col space-y-3 overflow-hidden">
              <SellerSelector sellers={users} selectedSellerId={currentSellerId} onSelectSeller={setCurrentSellerId} />
              {posRightPanelView === 'cart' ? (
                <>
                  <div className="flex-shrink-0">
                    <SelectedProductDisplay product={selectedProduct} categories={categories} currencySymbol={currencySymbol} />
                  </div>
                  <div className="flex-grow overflow-y-auto min-h-[150px] md:min-h-[200px]">
                    <CartDisplay cartItems={cartItems} discountPercentage={discountPercentage} onUpdateQuantity={updateCartItemQuantity} onRemoveItem={removeCartItem} currencySymbol={currencySymbol} />
                  </div>
                  <div className="flex-shrink-0">
                    <NumericKeypad onKeyPress={handleNumericKeyPress} onEnter={handleNumericEnter} onClear={handleNumericClear} currentValue={activeModal === ModalType.DISCOUNT ? tempDiscountInput : numericInputValue} />
                  </div>
                  <div className="flex-shrink-0">
                    <QuickActions onAction={handleQuickAction} state={quickActionsState} />
                  </div>
                </>
              ) : (
                <HeldTicketsDisplay tickets={heldTickets} onRetrieveTicket={handleRetrieveTicket} onCancel={() => setPosRightPanelView('cart')} />
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-gray-100 selection:bg-sky-200 selection:text-sky-800">
      <header className="bg-sky-600 text-white p-3 flex justify-between items-center font-bold shadow-md sticky top-0 z-20">
        <span className="text-lg">{establishmentDetails.name}</span>
        <span>Ticket: {currentTransactionInvoiceId}</span>
        <div className="flex items-center">
            {currentView === AppView.POS && (
                <div className="flex items-center gap-x-3 mr-4">
                    <button
                        onClick={() => setIsCloseDayModalOpen(true)}
                        title={isCloseDayDisabled ? "Finalisez toutes les opérations (panier et tickets en attente) avant de clôturer." : "Clôture journalier"}
                        disabled={isCloseDayDisabled}
                        className={`flex items-center px-3 py-1.5 text-white rounded-md transition-colors shadow-sm ${ isCloseDayDisabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                        <Icon name="LockClosedIcon" className="w-5 h-5 mr-1" />
                        <span className="text-sm font-semibold">Clôture</span>
                    </button>
                </div>
            )}
            <Icon name="UserIcon" className="w-5 h-5 mr-2" />
            <span>{loggedInUser.name} ({loggedInUser.role})</span>
        </div>
      </header>
      {renderCurrentView()}
      <BottomNavBar onNavigate={(view) => setCurrentView(view)} currentView={currentView} user={loggedInUser} />
      
      <Modal isOpen={activeModal === ModalType.DISCOUNT} onClose={() => { setActiveModal(ModalType.NONE); setTempDiscountInput('');}} title="Appliquer une Réduction (%)">
        <p className="mb-2 text-sm">Entrez le pourcentage de réduction. La valeur actuelle est {discountPercentage}%. Utilisez le clavier.</p>
         <div className="my-2 p-3 text-right text-2xl font-mono bg-gray-100 rounded-md h-12 overflow-x-auto">{tempDiscountInput || '0'}%</div>
        <div className="mt-4 flex justify-end space-x-2">
            <button onClick={() => { setTempDiscountInput(''); setActiveModal(ModalType.NONE);}} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Annuler</button>
            <button onClick={handleNumericEnter} className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600">Appliquer</button>
        </div>
      </Modal>

      <Modal isOpen={activeModal === ModalType.CONFIRM_CANCEL_CURRENT_WORK} onClose={() => setActiveModal(ModalType.NONE)} title="Annuler Travail en Cours">
        <p className="mb-4">Êtes-vous sûr de vouloir annuler le travail en cours ? Le panier sera vidé.</p>
        <div className="flex justify-end space-x-2">
            <button onClick={() => setActiveModal(ModalType.NONE)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Non</button>
            <button onClick={cancelCurrentWorkAction} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Oui, Annuler</button>
        </div>
      </Modal>
      
      <Modal isOpen={activeModal === ModalType.CONFIRM_DELETE_TRANSACTION} onClose={() => setActiveModal(ModalType.NONE)} title="Annuler la Facture">
        <p className="mb-4">Êtes-vous sûr de vouloir supprimer définitivement la facture N° {transactionForDeletion?.invoiceId}?</p>
        <div className="flex justify-end space-x-2">
            <button onClick={() => setActiveModal(ModalType.NONE)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Non</button>
            <button onClick={() => { if(transactionToDelete) handleDeleteTransaction(transactionToDelete) }} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Oui, Supprimer</button>
        </div>
      </Modal>

      <Modal isOpen={isCloseDayModalOpen} onClose={() => setIsCloseDayModalOpen(false)} title="Confirmer la Clôture Journalière">
        <p className="mb-4 text-gray-700">
            La clôture de journée est maintenant un concept de rapport. Vous pouvez générer un rapport financier pour n'importe quelle période dans l'onglet 'Financier'. Les données ne sont plus effacées.
        </p>
        <div className="flex justify-end space-x-3">
            <button onClick={handleDayClose} className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700">
                Compris
            </button>
        </div>
      </Modal>

      <PrintReceiptModal
        isOpen={activeModal === ModalType.PRINT_RECEIPT}
        onClose={() => {
            if (justPaid) { completeAndFinalizeTransaction(); setJustPaid(false); } 
            else { setActiveModal(ModalType.NONE); }
        }}
        cartItems={cartItems} discountPercentage={discountPercentage}
        sellerName={users.find(s => s.id === currentSellerId)?.name || 'N/A'}
        establishment={establishmentDetails} invoiceId={currentTransactionInvoiceId}
        currentDate={new Date()}
      />
      <PaymentModal
        isOpen={activeModal === ModalType.PAYMENT}
        onClose={() => setActiveModal(ModalType.NONE)}
        totalAmount={calculateTotals().totalTTC}
        paymentMethods={PAYMENT_METHODS}
        currencySymbol={currencySymbol}
        userRole={loggedInUser.role}
        onSubmitPayment={(method, roomNumber) => {
            const totals = calculateTotals();
            const transactionToComplete: CompletedTransaction = {
                id: `tx_${Date.now()}`,
                invoiceId: currentTransactionInvoiceId, date: new Date().toISOString(), items: JSON.parse(JSON.stringify(cartItems)), 
                sellerName: users.find(s => s.id === currentSellerId)?.name || 'N/A',
                paymentMethod: PAYMENT_METHODS.find(pm => pm.id === method)?.label || method, roomNumber: roomNumber,
                subTotalTTC: totals.subTotalTTC, discountPercentage: discountPercentage, discountAmount: totals.discountAmount,
                totalTTC: totals.totalTTC, totalHT: totals.totalHT, totalVAT: totals.totalVAT, vatBreakdown: totals.vatBreakdown,
            };
            setCompletedTransactions(prev => [transactionToComplete, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            setJustPaid(true);
            setInvoiceCounter(prev => prev + 1);
            setActiveModal(ModalType.PRINT_RECEIPT); 
        }}
      />
      {(isAddProductModalOpen || isEditProductModalOpen) && (
        <AddProductModal isOpen={isAddProductModalOpen || isEditProductModalOpen} onClose={() => { setIsAddProductModalOpen(false); setIsEditProductModalOpen(false); setEditingProduct(null); }}
          onAddProduct={handleAddProduct} onUpdateProduct={handleUpdateProduct} categories={categories} productToEdit={editingProduct} />
      )}
      {(isAddCategoryModalOpen || isEditCategoryModalOpen) && (
        <AddCategoryModal isOpen={isAddCategoryModalOpen || isEditCategoryModalOpen} onClose={() => { setIsAddCategoryModalOpen(false); setIsEditCategoryModalOpen(false); setEditingCategory(null); }}
          onAddCategory={handleAddCategory} onUpdateCategory={handleUpdateCategory} categoryToEdit={editingCategory} />
      )}
      {isAddUserModalOpen && (
        <AddUserModal isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)} onAddUser={handleAddUser} />
      )}
    </div>
  );
}

export default App;
