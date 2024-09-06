import { ProductsDataTransferService } from './../../../../shared/services/products/products-data-transfer.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/CreateProductRequest';
import { ProductsService } from 'src/app/services/products/products.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { EventAction } from 'src/app/models/interfaces/event/EventAction';
import { ProductEvent } from 'src/app/models/enums/products/ProductEvent';
import { EditProductRequest } from 'src/app/models/interfaces/products/request/EditProductRequest';
import { SaleProductRequest } from 'src/app/models/interfaces/products/request/saleProductRequest';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: []
})
export class ProductFormComponent implements OnInit, OnDestroy {
 private readonly destroy$: Subject<void> = new Subject();
 public categoriesDatas: Array<GetCategoriesResponse> = [];
 public selectedCategory: Array<{name: string; code: string}> = []
 public productAction!: {
    event: EventAction;
    productDatas: Array<GetAllProductsResponse>;
 }
 public productSelectedDatas!: GetAllProductsResponse;
 public productDatas!: Array<GetAllProductsResponse>;

  public addProductForm = this.FormBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount:[0, Validators.required]
  })

  public editProductForm = this.FormBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    amount:[0, Validators.required],
    category_id: ['', Validators.required]
  })

  public saleProductForm = this.FormBuilder.group({
    amount: [0, Validators.required],
    product_id: ['', Validators.required],
  })

  public saleProductSelected!: GetAllProductsResponse;
  public renderDropDown = false;

  public addProductAction = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductAction = ProductEvent.EDIT_PRODUCT_EVENT;
  public saleProductAction = ProductEvent.SALE_PRODUCT_EVENT;

 constructor(
  private categoriesService: CategoriesService,
  private productService: ProductsService,
  private productsDataTransferService: ProductsDataTransferService,
  private FormBuilder: FormBuilder,
  private messageService: MessageService,
  private router: Router,
  public ref: DynamicDialogConfig,

 ) {}

  ngOnInit(): void {
    this.productAction = this.ref.data;


    this.productAction?.event?.action == this.saleProductAction && this.getProductDatas();
    this.getAllCategories();

    this.renderDropDown = true;
  }


  getAllCategories(): void {
    this.categoriesService.getAllCategories()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if(response.length > 0) {
          this.categoriesDatas = response;

          if(this.productAction?.event?.action == this.editProductAction
            && this.productAction?.productDatas) {
              this.getProductSelectedDatas(this.productAction?.event?.id as string)
        }

        }
      }
    })
  }

  //para fazer o casting para o tipo number existe duas formas
  //1° Tipagem com o Number() e dentro dos parenteses colocar o que vc quer fazer o casting
  //2° inserir o + antes do valores a ser convertido
  handleSubmitAddProduct(): void {
    if(this.addProductForm?.value &&
        this.addProductForm?.valid) {
      const requestCreateProduct: CreateProductRequest = {
        name: this.addProductForm.value.name as string,
        price: this.addProductForm.value.price as string,
        description: this.addProductForm.value.description as string,
        category_id: this.addProductForm.value.category_id as string,
        amount: Number(this.addProductForm.value.amount)
       //amount: +this.addProductForm.value.amount,
      };

      this.productService.createProduct(requestCreateProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Produto adicionado com sucesso!',
                life: 2500
              });
            }
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar produto!',
              life: 2500,
            })
          }
        })
    }

    this.addProductForm.reset();
  }

  handleSubmitEditProduct(): void {
    if(this.editProductForm.value &&
        this.editProductForm.valid &&
          this.productAction.event.id){
      const requestEditProduct: EditProductRequest = {
        name: this.editProductForm.value.name as string,
        price: this.editProductForm.value.price as string,
        description: this.editProductForm.value.description as string,
        product_id: this.productAction?.event?.id,
        amount: Number(this.editProductForm.value.amount),
        category_id: this.editProductForm.value.category_id as string
      }

      this.productService.editProduct(requestEditProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity:'success',
              summary: 'Sucesso',
              detail: 'Produto editado com sucesso!',
              life: 2500

            });
            this.editProductForm.reset();
          }, error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar produto',
              life: 2500,
            });
            this.editProductForm.reset();
          }
        })
    }
  }

  getProductSelectedDatas(product_id: string): void {
    const allProducts = this.productAction?.productDatas;
    if(allProducts.length > 0) {
      const productFiltered = allProducts.filter(
        (element) => element?.id === product_id
      );

      if(productFiltered) {
        this.productSelectedDatas = productFiltered[0];

        //set value => setar um valor existente em nosso formulario
        this.editProductForm.setValue({
          name: this.productSelectedDatas?.name,
          price: this.productSelectedDatas?.price,
          description: this.productSelectedDatas?.description,
          amount: this.productSelectedDatas?.amount,
          category_id: this.productSelectedDatas?.category?.id
        })
      }
    }
  }

  getProductDatas(): void{
    this.productService.getAllProducts()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if(response.length > 0) {
          this.productDatas = response;

          //esse && fora do if indica que se for true fará algo
          //caso seja false, fara nada
          this.productDatas && this.productsDataTransferService.setProductsDatas(this.productDatas)
        }
      }
    })
  }

  handleSubmitSaleProduct(): void {
    if(this.saleProductForm.value &&
        this.saleProductForm.valid) {
          const requestDatas: SaleProductRequest = {
            amount: this.saleProductForm.value.amount as number,
            product_id: this.saleProductForm.value.product_id as string
          }

          this.productService.saleProduct(requestDatas)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next:(response) => {
                this.saleProductForm.reset();
                this.getProductDatas();
                this.messageService.add({
                  severity:'success',
                  summary: 'Sucesso',
                  detail: 'Venda editada com sucesso!',
                  life: 2500

                });
                this.router.navigate(['/dashboard'])
              },
              error: (err) => {
                console.log(err);
                this.saleProductForm.reset();
                this.messageService.add({
                  severity:'error',
                  summary: 'Erro',
                  detail: 'Erro ao vender produto!',
                  life: 2500

                });
              }
            })
        }
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
