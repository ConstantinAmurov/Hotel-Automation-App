package com.example.hotel_app;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import java.util.HashMap;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MainActivity extends AppCompatActivity {

    private Retrofit retrofit;
    private RetrofitInterface retrofitInterface;
    private String BASE_URL =  "http://localhost:3000"; //"http://10.0.2.2:3000"; - adress for android studio emulator  //"http://192.168.56.1:3000"; // - adress of my pc host

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        retrofitInterface = retrofit.create(RetrofitInterface.class);

        findViewById(R.id.btn_login).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                handleLogin();
            }
        });
    }

    private void handleLogin() {

        Button loginBtn = findViewById(R.id.btn_login);
        EditText usernameEdit = findViewById(R.id.edt_username);
        EditText passwordEdit = findViewById(R.id.edt_password);

        loginBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                HashMap<String, String> map = new HashMap<>();

                map.put("username", usernameEdit.getText().toString());
                map.put("password", passwordEdit.getText().toString());

                Call<LoginResult> call = retrofitInterface.executeLogin(map);
                
                call.enqueue(new Callback<LoginResult>() {
                    @Override
                    public void onResponse(Call<LoginResult> call, Response<LoginResult> response) {

                        if (response.code() == 200) {

                            LoginResult result = response.body();

                            AlertDialog.Builder builder1 = new AlertDialog.Builder(MainActivity.this);
                            builder1.setTitle(result.getUsername());
                            builder1.setMessage(result.getUsername());

                            builder1.show();
                        } else if (response.code() == 404) {
                            Toast.makeText(MainActivity.this, "Wrong Credentials", Toast.LENGTH_LONG).show();
                        }

                    }

                    @Override
                    public void onFailure(Call<LoginResult> call, Throwable t) {
                        Toast.makeText(MainActivity.this, t.getMessage(),
                                Toast.LENGTH_LONG).show();
                    }
                });
                
            }
        });

        TextView createAccount = findViewById(R.id.txt_create_account);
        createAccount.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(MainActivity.this, "We do not register accounts from the app at the moment", Toast.LENGTH_LONG).show();
            }
        });

        Button nfcShortcut = findViewById(R.id.btn_nfc);
        nfcShortcut.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(MainActivity.this, "*SECTION UNFINISHED*", Toast.LENGTH_LONG).show();
            }
        });
    }
}