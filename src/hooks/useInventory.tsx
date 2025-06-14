
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { InventoryItem, InventoryAdjustment, AdjustmentReason, UnitOfMeasure } from '@/types';

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [adjustments, setAdjustments] = useState<InventoryAdjustment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      const transformedItems: InventoryItem[] = data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        category: item.category || '',
        unitOfMeasure: item.unit_of_measure as UnitOfMeasure,
        purchaseCost: item.purchase_cost,
        sellingPrice: item.selling_price,
        currentStock: item.current_stock,
        reorderLevel: item.reorder_level,
        sku: item.sku || '',
        isActive: item.is_active,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at)
      }));

      setItems(transformedItems);
      console.log('Inventory items loaded:', data?.length);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      toast.error('Failed to load inventory items');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAdjustments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_adjustments')
        .select(`
          *,
          inventory_items (id, name, unit_of_measure)
        `)
        .order('adjustment_date', { ascending: false });

      if (error) throw error;

      const formattedAdjustments: InventoryAdjustment[] = data.map(adjustment => ({
        id: adjustment.id,
        itemId: adjustment.item_id,
        previousQuantity: adjustment.previous_quantity,
        newQuantity: adjustment.new_quantity,
        reason: adjustment.reason as AdjustmentReason,
        notes: adjustment.notes || '',
        adjustmentDate: new Date(adjustment.adjustment_date),
        createdBy: adjustment.created_by || 'System',
        item: {
          id: adjustment.inventory_items.id,
          name: adjustment.inventory_items.name,
          unitOfMeasure: adjustment.inventory_items.unit_of_measure as UnitOfMeasure,
          description: '',
          category: '',
          purchaseCost: 0,
          sellingPrice: 0,
          currentStock: 0,
          reorderLevel: 0,
          sku: '',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }));

      setAdjustments(formattedAdjustments);
    } catch (error) {
      console.error('Error fetching inventory adjustments:', error);
      toast.error('Failed to load inventory adjustments');
    }
  }, []);

  const refreshInventoryData = useCallback(async () => {
    await Promise.all([
      fetchItems(),
      fetchAdjustments()
    ]);
  }, [fetchItems, fetchAdjustments]);

  useEffect(() => {
    refreshInventoryData();
  }, [refreshInventoryData]);

  const addItem = useCallback(async (itemData: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase.from('inventory_items').insert({
        name: itemData.name,
        description: itemData.description,
        category: itemData.category,
        unit_of_measure: itemData.unitOfMeasure,
        purchase_cost: itemData.purchaseCost,
        selling_price: itemData.sellingPrice,
        current_stock: itemData.currentStock,
        reorder_level: itemData.reorderLevel,
        sku: itemData.sku,
        is_active: itemData.isActive
      }).select().single();

      if (error) throw error;

      const newItem: InventoryItem = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        category: data.category || '',
        unitOfMeasure: data.unit_of_measure as UnitOfMeasure,
        purchaseCost: data.purchase_cost,
        sellingPrice: data.selling_price,
        currentStock: data.current_stock,
        reorderLevel: data.reorder_level,
        sku: data.sku || '',
        isActive: data.is_active,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setItems((prevItems) => [...prevItems, newItem]);
      toast.success('Inventory item added successfully');
      return newItem;
    } catch (error) {
      console.error('Error adding inventory item:', error);
      toast.error('Failed to add inventory item');
      throw error;
    }
  }, []);

  const updateItem = useCallback(async (id: string, itemData: Partial<InventoryItem>) => {
    try {
      const { data, error } = await supabase.from('inventory_items').update({
        name: itemData.name,
        description: itemData.description,
        category: itemData.category,
        unit_of_measure: itemData.unitOfMeasure,
        purchase_cost: itemData.purchaseCost,
        selling_price: itemData.sellingPrice,
        current_stock: itemData.currentStock,
        reorder_level: itemData.reorderLevel,
        sku: itemData.sku,
        is_active: itemData.isActive,
        updated_at: new Date().toISOString()
      }).eq('id', id).select().single();

      if (error) throw error;

      const updatedItem: InventoryItem = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        category: data.category || '',
        unitOfMeasure: data.unit_of_measure as UnitOfMeasure,
        purchaseCost: data.purchase_cost,
        sellingPrice: data.selling_price,
        currentStock: data.current_stock,
        reorderLevel: data.reorder_level,
        sku: data.sku || '',
        isActive: data.is_active,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setItems(prevItems => 
        prevItems.map(item => item.id === id ? updatedItem : item)
      );

      toast.success('Inventory item updated successfully');
      return updatedItem;
    } catch (error) {
      console.error('Error updating inventory item:', error);
      toast.error('Failed to update inventory item');
      throw error;
    }
  }, []);

  const updateItemStock = useCallback(async (id: string, newQuantity: number) => {
    try {
      const item = items.find((item) => item.id === id);
      if (!item) throw new Error('Item not found');

      const previousQuantity = item.currentStock;

      await updateItem(id, {
        currentStock: newQuantity
      });

      return {
        previousQuantity,
        newQuantity
      };
    } catch (error) {
      console.error('Error updating item stock:', error);
      toast.error('Failed to update item stock');
      throw error;
    }
  }, [items, updateItem]);

  const createInventoryAdjustment = useCallback(async (
    itemId: string, 
    previousQuantity: number, 
    newQuantity: number, 
    reason: AdjustmentReason, 
    notes?: string
  ) => {
    try {
      const item = items.find((item) => item.id === itemId);
      if (!item) throw new Error('Item not found');

      const { data, error } = await supabase.from('inventory_adjustments').insert({
        item_id: itemId,
        previous_quantity: previousQuantity,
        new_quantity: newQuantity,
        reason,
        notes,
        created_by: 'User'
      }).select().single();

      if (error) throw error;

      await updateItem(itemId, {
        currentStock: newQuantity
      });

      const newAdjustment: InventoryAdjustment = {
        id: data.id,
        itemId,
        previousQuantity,
        newQuantity,
        reason,
        notes: notes || '',
        adjustmentDate: new Date(data.adjustment_date),
        createdBy: data.created_by || 'User',
        item: {
          id: item.id,
          name: item.name,
          unitOfMeasure: item.unitOfMeasure,
          description: item.description,
          category: item.category,
          purchaseCost: item.purchaseCost,
          sellingPrice: item.sellingPrice,
          currentStock: newQuantity,
          reorderLevel: item.reorderLevel,
          sku: item.sku,
          isActive: item.isActive,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }
      };

      setAdjustments((prevAdjustments) => [newAdjustment, ...prevAdjustments]);
      toast.success('Inventory adjustment created successfully');
      return newAdjustment;
    } catch (error) {
      console.error('Error creating inventory adjustment:', error);
      toast.error('Failed to create inventory adjustment');
      throw error;
    }
  }, [items, updateItem]);

  const deleteItem = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setItems(prevItems => prevItems.filter(item => item.id !== id));
      toast.success('Inventory item deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete inventory item');
      throw error;
    }
  }, []);

  const adjustStock = useCallback(async (
    itemId: string, 
    quantityChange: number, 
    reason: AdjustmentReason, 
    notes?: string
  ) => {
    try {
      const item = items.find((item) => item.id === itemId);
      if (!item) throw new Error('Item not found');

      const previousQuantity = item.currentStock;
      const newQuantity = previousQuantity + quantityChange;

      if (newQuantity < 0) {
        throw new Error('Adjustment would result in negative stock');
      }

      await createInventoryAdjustment(
        itemId,
        previousQuantity,
        newQuantity,
        reason,
        notes
      );

      return {
        previousQuantity,
        newQuantity
      };
    } catch (error) {
      console.error('Error adjusting stock:', error);
      toast.error('Failed to adjust stock');
      throw error;
    }
  }, [items, createInventoryAdjustment]);

  const increaseStock = useCallback(async (
    itemId: string,
    quantity: number,
    reason: AdjustmentReason = 'return',
    notes?: string
  ) => {
    return adjustStock(itemId, quantity, reason, notes);
  }, [adjustStock]);

  const getItemById = useCallback((id: string) => {
    return items.find((item) => item.id === id);
  }, [items]);

  return {
    items,
    adjustments,
    isLoading,
    fetchItems,
    fetchAdjustments,
    refreshInventoryData,
    addItem,
    updateItem,
    updateItemStock,
    createInventoryAdjustment,
    deleteItem,
    getItemById,
    adjustStock,
    increaseStock
  };
}
